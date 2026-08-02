export function PendingResultCard() {
  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
        Nepieciešama darbība
      </p>

      <h2 className="mt-3 text-xl font-semibold text-black">
        Ievadi spēles rezultātu
      </h2>

      <p className="mt-2 text-sm text-black/60">
        Vakardienas spēle pret Kārli Ozolu vēl nav noslēgta aplikācijā.
      </p>

      <button
        type="button"
        className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Ievadīt rezultātu
      </button>
    </section>
  );
}