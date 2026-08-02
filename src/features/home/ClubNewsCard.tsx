export function ClubNewsCard() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
        BTK jaunumi
      </p>

      <h2 className="mt-3 text-xl font-semibold text-black">
        Pavasara turnīrs sākas 1. jūnijā
      </h2>

      <p className="mt-2 text-sm leading-6 text-black/60">
        Spēļu grafiks un grupu sadalījums būs pieejams aplikācijā pirms
        turnīra sākuma.
      </p>

      <button
        type="button"
        className="mt-5 text-sm font-semibold text-black underline-offset-4 hover:underline"
      >
        Lasīt vairāk
      </button>
    </section>
  );
}