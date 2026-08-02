export function NextMatchCard() {
  return (
    <section className="rounded-3xl bg-black p-5 text-white shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
        Nākamā spēle
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-white/60">Roberts Pļāvējs</p>
          <p className="mt-1 text-2xl font-semibold">pret Mārtiņu Paleju</p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl">
          🎾
        </div>
      </div>

      <div className="mt-6 grid gap-2 text-sm text-white/70">
        <p>Trešdien, 19:00</p>
        <p>Bīriņa tenisa klubs</p>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        Skatīt spēli
      </button>
    </section>
  );
}