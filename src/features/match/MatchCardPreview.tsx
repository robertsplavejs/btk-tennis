import clsx from "clsx";
import type { Ref } from "react";

import { formatMatchScore } from "@/lib/formatMatchScore";
import type { TournamentMatch } from "@/types/match";
import type { MatchCardStyle } from "@/types/matchCard";

type MatchCardPreviewProps = {
  match: TournamentMatch;
  tournamentName?: string;
  backgroundImageUrl?: string;
  previewRef?: Ref<HTMLDivElement>;
  cardStyle?: MatchCardStyle;
};

export function MatchCardPreview({
  match,
  tournamentName = "BTK Summer League",
  backgroundImageUrl,
  previewRef,
  cardStyle = "premium",
}: MatchCardPreviewProps) {
  const winner =
    match.winnerId === match.playerOne.id
      ? match.playerOne
      : match.playerTwo;

  const isPremium = cardStyle === "premium";
  const isScore = cardStyle === "score";
  const isClean = cardStyle === "clean";

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div
        ref={previewRef}
        className={clsx(
          "relative aspect-[9/16] overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]",
          isClean ? "bg-[#f5f1e8]" : "bg-neutral-900"
        )}
      >
        {backgroundImageUrl ? (
          // Izmantojam īstu attēla elementu, lai tas nonāktu arī PNG eksportā.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            {isPremium && (
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black" />
            )}

            {isScore && (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--btk-primary)] via-neutral-900 to-black" />
            )}
          </>
        )}

        {backgroundImageUrl && (
          <div
            className={clsx(
              "absolute inset-0",
              isPremium &&
                "bg-gradient-to-b from-black/20 via-black/25 to-black/90",
              isScore &&
                "bg-gradient-to-b from-black/50 via-black/35 to-black/90",
              isClean && "bg-white/70"
            )}
          />
        )}

        <div
          className={clsx(
            "relative z-10 flex h-full flex-col justify-between p-6",
            isClean ? "text-slate-900" : "text-white"
          )}
        >
          <header className="flex items-start justify-between gap-4">
            <div>
              <p
                className={clsx(
                  "text-xs font-semibold uppercase tracking-[0.18em]",
                  isClean ? "text-slate-500" : "text-white/65"
                )}
              >
                {tournamentName}
              </p>

              <p
                className={clsx(
                  "mt-2 text-sm",
                  isClean ? "text-slate-600" : "text-white/80"
                )}
              >
                Vīrieši A
              </p>
            </div>

            <div
              className={clsx(
                "flex h-12 w-12 items-center justify-center rounded-full text-sm font-black",
                isClean
                  ? "bg-[var(--btk-primary)] text-white"
                  : "bg-white text-black"
              )}
            >
              BTK
            </div>
          </header>

          {isPremium && (
            <div>
              <div className="rounded-[28px] border border-white/15 bg-black/35 p-5 backdrop-blur-md">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Spēles rezultāts
                </p>

                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="text-right text-base font-semibold leading-tight">
                    {match.playerOne.name}
                  </p>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                    pret
                  </span>

                  <p className="text-left text-base font-semibold leading-tight">
                    {match.playerTwo.name}
                  </p>
                </div>

                <p className="mt-7 text-center text-4xl font-bold tracking-tight">
                  {formatMatchScore(match)}
                </p>

                <div className="mt-6 border-t border-white/15 pt-4 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                    Uzvarētājs
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {winner.name}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                Bīriņa tenisa klubs
              </p>
            </div>
          )}

          {isScore && (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Gala rezultāts
              </p>

              <p className="mt-8 text-5xl font-black tracking-tight">
                {formatMatchScore(match)}
              </p>

              <div className="mt-10 space-y-3">
                <p className="text-xl font-semibold">
                  {match.playerOne.name}
                </p>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  pret
                </p>

                <p className="text-xl font-semibold">
                  {match.playerTwo.name}
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-white/15 bg-black/30 px-5 py-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                  Uzvarētājs
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {winner.name}
                </p>
              </div>
            </div>
          )}

          {isClean && (
            <div>
              <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Spēles rezultāts
                </p>

                <p className="mt-6 text-4xl font-bold tracking-tight text-[var(--btk-primary)]">
                  {formatMatchScore(match)}
                </p>

                <div className="mt-7 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {match.playerOne.name}
                    </span>

                    {match.winnerId === match.playerOne.id && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Uzvarētājs
                      </span>
                    )}
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {match.playerTwo.name}
                    </span>

                    {match.winnerId === match.playerTwo.id && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Uzvarētājs
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Bīriņa tenisa klubs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}