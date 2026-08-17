import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";

import { updatePassword } from "./actions";

type PasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    recovery?: string;
  }>;
};

export default async function PasswordPage({ searchParams }: PasswordPageProps) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  const { error, message, recovery } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-sm text-neutral-500">BTK Tennis</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          {recovery === "1" ? "Izveidot jaunu paroli" : "Mainīt paroli"}
        </h1>

        {message ? (
          <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
            {message}
          </p>
        ) : (
          <form action={updatePassword} className="mt-6 space-y-4">
            <input type="hidden" name="recovery" value={recovery === "1" ? "1" : "0"} />
            {recovery !== "1" && (
              <label className="block">
                <span className="text-sm font-medium text-black">Pašreizējā parole</span>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black"
                />
              </label>
            )}
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
              <span className="text-sm font-medium text-black">Atkārto jauno paroli</span>
              <input
                type="password"
                name="passwordConfirmation"
                autoComplete="new-password"
                required
                minLength={8}
                className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-black"
              />
            </label>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white">
              Saglabāt jauno paroli
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href={identity.playerId ? "/profile" : "/admin"} className="font-semibold text-black">
            Atpakaļ
          </Link>
        </p>
      </div>
    </div>
  );
}
