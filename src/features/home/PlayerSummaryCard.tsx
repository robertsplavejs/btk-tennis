export function PlayerSummaryCard() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700">
          RP
        </div>

        <div className="min-w-0">
          <p className="truncate text-xl font-semibold text-black">
            Roberts Pļāvējs
          </p>
          <p className="mt-1 text-sm text-black/50">Vīrieši A grupa</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-black/10 rounded-2xl bg-neutral-50 py-4 text-center">
        <div>
          <p className="text-xl font-semibold text-black">3.</p>
          <p className="mt-1 text-xs text-black/50">Vieta</p>
        </div>

        <div>
          <p className="text-xl font-semibold text-black">13–5</p>
          <p className="mt-1 text-xs text-black/50">Bilance</p>
        </div>

        <div>
          <p className="text-xl font-semibold text-black">72%</p>
          <p className="mt-1 text-xs text-black/50">Uzvaras</p>
        </div>
      </div>
    </section>
  );
}