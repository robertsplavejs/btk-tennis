"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSeasonService } from "@/services/createSeasonService";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function createSeason(formData: FormData) {
  const clubId = String(formData.get("clubId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const startsOn = String(formData.get("startsOn") ?? "").trim();
  const endsOn = String(formData.get("endsOn") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  try {
    await requireAdmin();
    const seasonService = await createSeasonService();

    await seasonService.createSeason({
      clubId,
      name,
      startsOn: startsOn || undefined,
      endsOn: endsOn || undefined,
      isActive,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās izveidot sezonu.";

    redirect(
      `/admin/seasons/new?error=${encodeURIComponent(message)}`
    );
  }

  revalidatePath("/admin/seasons");
  redirect("/admin/seasons");
}
