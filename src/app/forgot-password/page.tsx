import Link from "next/link";

import { PasswordResetForm } from "./PasswordResetForm";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-sm text-neutral-500">BTK Tennis</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Atjaunot paroli
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Ievadi sava konta e-pastu. Nosūtīsim saiti jaunas paroles izveidei.
        </p>

        {message ? (
          <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm leading-6 text-green-700" role="status">
            {message}
          </p>
        ) : (
          <PasswordResetForm initialError={error} />
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/login" className="font-semibold text-black">
            Atpakaļ uz ielogošanos
          </Link>
        </p>
      </div>
    </div>
  );
}
