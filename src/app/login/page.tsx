import Link from "next/link";

import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-sm text-neutral-500">
            BTK Tennis
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Ielogoties
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Ievadi savu e-pastu un paroli, lai piekļūtu
            turnīriem un savām spēlēm.
          </p>
        </div>

        {message && (
          <p
            className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700"
            role="status"
          >
            {message}
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              required
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
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
          >
            Ielogoties
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-semibold text-neutral-600">
            Aizmirsi paroli?
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Vēl nav konta?{" "}
          <Link
            href="/register"
            className="font-semibold text-black"
          >
            Reģistrēties
          </Link>
        </p>
      </div>
    </div>
  );
}
