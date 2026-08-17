"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

const invalidLinkMessage =
  "Paroles atjaunošanas saite nav derīga vai tās termiņš ir beidzies.";

export default function PasswordRecoveryPage() {
  const [message, setMessage] = useState("Pārbauda atjaunošanas saiti...");
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formError, setFormError] = useState("");
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function completeRecovery() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hasRecoveryCredential = Boolean(
        code || tokenHash || (accessToken && refreshToken)
      );

      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession();

      if (existingSession && hasRecoveryCredential) {
        setMessage("");
        setIsReady(true);
        return;
      }

      let error: Error | null = null;

      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        error = result.error;
      } else if (tokenHash && type === "recovery") {
        const result = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        error = result.error;
      } else if (accessToken && refreshToken) {
        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        error = result.error;
      } else {
        error = new Error("Recovery credentials are missing.");
      }

      if (error) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && hasRecoveryCredential) {
          setMessage("");
          setIsReady(true);
          return;
        }

        console.error("PASSWORD RECOVERY ERROR:", error);
        setMessage(invalidLinkMessage);
        return;
      }

      setMessage("");
      setIsReady(true);
    }

    void completeRecovery();
  }, []);

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(
      formData.get("passwordConfirmation") ?? ""
    );

    if (password.length < 8) {
      setFormError("Parolei jābūt vismaz 8 rakstzīmes garai.");
      return;
    }

    if (password !== confirmation) {
      setFormError("Ievadītās paroles nesakrīt.");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("PASSWORD UPDATE ERROR:", error);
      setFormError("Paroli neizdevās nomainīt. Mēģini vēlreiz.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setIsComplete(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-sm text-neutral-500">BTK Tennis</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-black">
          Paroles atjaunošana
        </h1>
        {isComplete ? (
          <div className="mt-5">
            <p
              className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700"
              role="status"
            >
              Parole veiksmīgi nomainīta.
            </p>
            <Link
              href="/"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white"
            >
              Atgriezties aplikācijā
            </Link>
          </div>
        ) : isReady ? (
          <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4 text-left">
            <label className="block">
              <span className="text-sm font-medium text-black">Jaunā parole</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-black">
                Atkārto jauno paroli
              </span>
              <input
                type="password"
                name="passwordConfirmation"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black"
              />
            </label>

            {formError && (
              <p
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {formError}
              </p>
            )}

            <button
              disabled={isSaving}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
            >
              {isSaving ? "Saglabā..." : "Saglabāt jauno paroli"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm leading-6 text-neutral-500" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
