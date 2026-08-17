"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("BTK Tennis lapas kļūda:", error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-12 text-center">
      <div className="max-w-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
          Neizdevās ielādēt
        </p>
        <h1 className="mt-3 text-2xl font-black text-neutral-950">
          Radās īslaicīga kļūda
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Dati netika mainīti. Mēģini ielādēt šo sadaļu vēlreiz.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="h-11 rounded-xl bg-neutral-950 px-5 text-sm font-bold text-white"
          >
            Mēģināt vēlreiz
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-bold text-neutral-800 no-underline"
          >
            Uz sākumu
          </Link>
        </div>
      </div>
    </main>
  );
}
