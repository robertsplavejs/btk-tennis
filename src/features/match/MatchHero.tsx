import { Card } from "@/components/ui/Card";
import { formatMatchScore } from "@/lib/formatMatchScore";
import type { TournamentMatch } from "@/types/match";

type MatchHeroProps = {
  match: TournamentMatch;
};

function formatScheduledDate(dateValue?: string) {
  if (!dateValue) {
    return "Laiks vēl nav norādīts";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Laiks vēl nav norādīts";
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status: TournamentMatch["status"]) {
  if (status === "scheduled") {
    return "Ieplānota";
  }

  if (status === "completed") {
    return "Pabeigta";
  }

  if (status === "cancelled") {
    return "Atcelta";
  }

  return "Nav ieplānota";
}

export function MatchHero({ match }: MatchHeroProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-[var(--btk-primary)] p-6 text-white">
        <div className="flex justify-center">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {getStatusLabel(match.status)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="min-w-0 text-center">
            <p className="truncate text-lg font-semibold">
              {match.playerOne.name}
            </p>

            {match.playerOne.ranking !== undefined && (
              <p className="mt-1 text-sm text-white/70">
                {match.playerOne.ranking}. vieta
              </p>
            )}

            {match.playerOne.points !== undefined && (
              <p className="mt-1 text-xs text-white/50">
                {match.playerOne.points} punkti
              </p>
            )}
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
            pret
          </span>

          <div className="min-w-0 text-center">
            <p className="truncate text-lg font-semibold">
              {match.playerTwo.name}
            </p>

            {match.playerTwo.ranking !== undefined && (
              <p className="mt-1 text-sm text-white/70">
                {match.playerTwo.ranking}. vieta
              </p>
            )}

            {match.playerTwo.points !== undefined && (
              <p className="mt-1 text-xs text-white/50">
                {match.playerTwo.points} punkti
              </p>
            )}
          </div>
        </div>

        {match.status === "completed" && (
          <p className="mt-7 text-center text-3xl font-bold tracking-tight">
            {formatMatchScore(match)}
          </p>
        )}

        {match.status === "scheduled" && (
          <div className="mt-7 text-center">
            <p className="text-lg font-semibold capitalize">
              {formatScheduledDate(match.scheduledAt)}
            </p>

            {match.court && (
              <p className="mt-2 text-sm text-white/70">
                {match.court}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        {match.location && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Vieta
            </p>

            <p className="mt-1 text-sm font-semibold text-black">
              {match.location}
            </p>
          </div>
        )}

        {match.notes && (
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-sm font-medium text-black">
              {match.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}