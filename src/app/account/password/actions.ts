"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("passwordConfirmation") ?? "");
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const recovery = formData.get("recovery") === "1";
  const basePath = `/account/password${recovery ? "?recovery=1" : ""}`;

  if (password.length < 8) {
    redirect(
      `${basePath}${basePath.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        "Parolei jābūt vismaz 8 rakstzīmes garai."
      )}`
    );
  }

  if (password !== confirmation) {
    redirect(
      `${basePath}${basePath.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        "Ievadītās paroles nesakrīt."
      )}`
    );
  }

  const supabase = await createClient();
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Lai mainītu paroli, atver derīgu atjaunošanas saiti vai ielogojies."
      )}`
    );
  }

  if (!recovery) {
    const email = identity.authUser.email;

    if (!email || !currentPassword) {
      redirect(
        `/account/password?error=${encodeURIComponent(
          "Ievadi pašreizējo paroli."
        )}`
      );
    }

    const { error: verificationError } =
      await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (verificationError) {
      redirect(
        `/account/password?error=${encodeURIComponent(
          "Pašreizējā parole nav pareiza."
        )}`
      );
    }
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `${basePath}${basePath.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        "Paroli neizdevās nomainīt. Mēģini vēlreiz."
      )}`
    );
  }

  revalidatePath("/", "layout");
  redirect(
    `/account/password?message=${encodeURIComponent(
      "Parole veiksmīgi nomainīta."
    )}`
  );
}
