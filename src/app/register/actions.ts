"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function registerUrl(token: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);

  if (token) {
    searchParams.set("token", token);
  }

  return `/register?${searchParams.toString()}`;
}

export async function register(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  const passwordConfirmation = String(
    formData.get("passwordConfirmation") ?? ""
  );

  if (!token) {
    redirect(
      registerUrl("", {
        error: "Reģistrācijai nepieciešama administratora uzaicinājuma saite.",
      })
    );
  }

  if (!email) {
    redirect(
      registerUrl(token, {
        error: "Ievadi derīgu e-pasta adresi.",
      })
    );
  }

  if (password.length < 8) {
    redirect(
      registerUrl(token, {
        error:
          "Parolei jābūt vismaz 8 rakstzīmes garai.",
      })
    );
  }

  if (password !== passwordConfirmation) {
    redirect(
      registerUrl(token, {
        error: "Ievadītās paroles nesakrīt.",
      })
    );
  }

  const supabase = await createClient();

  const { data: preview, error: previewError } = await supabase.rpc(
    "get_account_invitation_preview",
    { invitation_token: token }
  );

  const invitation = preview?.[0];

  if (previewError || !invitation) {
    redirect(
      registerUrl(token, {
        error: "Uzaicinājuma saite nav derīga vai tās termiņš ir beidzies.",
      })
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: invitation.display_name,
        invitation_token: token,
      },
    },
  });

  if (error) {
    console.error("SIGNUP ERROR:", error);

    redirect(
      registerUrl(token, {
        error: error.message,
      })
    );
  }

  if (data.session) {
    redirect("/");
  }

  redirect(
    `/login?message=${encodeURIComponent(
      "Konts izveidots. Pārbaudi e-pastu un apstiprini reģistrāciju."
    )}`
  );
}
