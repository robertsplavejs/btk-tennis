"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createClient } from "@/lib/supabase/server";

export type UpdateAvatarState = {
  status: "idle" | "success" | "error";
  message: string;
};

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

async function hasValidImageSignature(
  image: File,
  imageType: string
) {
  const bytes = new Uint8Array(
    await image.slice(0, 12).arrayBuffer()
  );

  if (imageType === "image/jpeg") {
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (imageType === "image/png") {
    const pngSignature = [
      0x89, 0x50, 0x4e, 0x47,
      0x0d, 0x0a, 0x1a, 0x0a,
    ];

    return pngSignature.every(
      (value, index) => bytes[index] === value
    );
  }

  if (imageType === "image/webp") {
    const text = String.fromCharCode(...bytes);
    return text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
  }

  return false;
}

export async function updateProfileAvatar(
  _previousState: UpdateAvatarState,
  formData: FormData
): Promise<UpdateAvatarState> {
  const image = formData.get("avatar");

  if (!(image instanceof File) || image.size === 0) {
    return { status: "error", message: "Izvēlies attēlu." };
  }

  const extension = allowedImageTypes.get(image.type);

  if (!extension) {
    return { status: "error", message: "Izmanto JPG, PNG vai WEBP attēlu." };
  }

  if (image.size > 5 * 1024 * 1024) {
    return { status: "error", message: "Attēla izmērs nedrīkst pārsniegt 5 MB." };
  }

  if (!(await hasValidImageSignature(image, image.type))) {
    return {
      status: "error",
      message: "Izvēlētais fails nav derīgs attēls.",
    };
  }

  const supabase = await createClient();
  const identity = await getCurrentIdentity();

  if (!identity?.playerId) {
    return { status: "error", message: "Lai mainītu bildi, nepieciešams ielogoties." };
  }

  let optimizedImage: Buffer;

  try {
    optimizedImage = await sharp(
      Buffer.from(await image.arrayBuffer()),
      { limitInputPixels: 40_000_000 }
    )
      .rotate()
      .resize(512, 512, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  } catch {
    return {
      status: "error",
      message: "Attēlu neizdevās apstrādāt. Izvēlies citu failu.",
    };
  }

  const filePath = `${identity.userId}/avatar-${Date.now()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(filePath, optimizedImage, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    return { status: "error", message: "Bildes augšupielāde neizdevās. Mēģini vēlreiz." };
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-avatars")
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("players")
    .update({
      avatar_url: publicUrlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", identity.playerId);

  if (updateError) {
    await supabase.storage.from("profile-avatars").remove([filePath]);
    return { status: "error", message: "Bildes saglabāšana neizdevās. Mēģini vēlreiz." };
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/matches");
  revalidatePath("/tournament");

  return { status: "success", message: "Profila bilde nomainīta." };
}
