import Link from "next/link";

import { register } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    token?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error, token = "" } = await searchParams;

  let invitation:
    | { display_name: string; is_admin: boolean; expires_at: string }
    | undefined;

  if (token) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_account_invitation_preview", {
      invitation_token: token,
    });
    invitation = data?.[0];
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-sm text-neutral-500">
            BTK Tennis
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Izveidot kontu
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {invitation
              ? `Uzaicinājums paredzēts: ${invitation.display_name}.`
              : "Kontu var izveidot tikai ar BTK administratora uzaicinājumu."}
          </p>
        </div>

        <form action={register} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />

          <label className="block">
            <span className="text-sm font-medium text-black">
              E-pasts
            </span>

            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">
              Parole
            </span>

            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">
              Atkārto paroli
            </span>

            <input
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
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
            type="submit"
            disabled={!invitation}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
          >
            Izveidot kontu
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Konts jau ir?{" "}
          <Link
            href="/login"
            className="font-semibold text-black"
          >
            Ielogoties
          </Link>
        </p>
      </div>
    </div>
  );
}
