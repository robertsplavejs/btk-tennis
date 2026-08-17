"use client";

import { useState, type FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";

type PasswordResetFormProps = {
  initialError?: string;
};

export function PasswordResetForm({ initialError }: PasswordResetFormProps) {
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) {
      setError("Ievadi e-pasta adresi.");
      setIsSending(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/recovery`,
      }
    );

    if (resetError) {
      console.error("PASSWORD RESET REQUEST ERROR:", resetError);
      setError("Atjaunošanas saiti neizdevās nosūtīt. Mēģini vēlreiz.");
      setIsSending(false);
      return;
    }

    setMessage(
      "Ja šāds konts pastāv, uz norādīto e-pastu nosūtījām paroles atjaunošanas saiti. Atver to šajā pašā pārlūkā."
    );
    setIsSending(false);
  }

  if (message) {
    return (
      <p
        className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm leading-6 text-green-700"
        role="status"
      >
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-black">E-pasts</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black"
        />
      </label>

      {error && (
        <p
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        disabled={isSending}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
      >
        {isSending ? "Nosūta..." : "Nosūtīt atjaunošanas saiti"}
      </button>
    </form>
  );
}
