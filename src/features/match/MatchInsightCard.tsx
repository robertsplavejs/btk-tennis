import { Card } from "@/components/ui/Card";
import type { TournamentMatch } from "@/types/match";

type MatchInsightCardProps = {
  match: TournamentMatch;
};

function getDefaultInsight(match: TournamentMatch) {
  if (match.status === "completed") {
    return "Spēle ir pabeigta. Rezultāts jau ir ieskaitīts turnīra tabulā.";
  }

  if (match.status === "scheduled") {
    return "Šī spēle var ietekmēt abu spēlētāju pozīcijas turnīra tabulā.";
  }

  if (match.status === "cancelled") {
    return "Spēle ir atcelta. Ja nepieciešams, sazinies ar turnīra administratoru.";
  }

  return "Spēles laiks vēl nav saskaņots.";
}

export function MatchInsightCard({
  match,
}: MatchInsightCardProps) {
  const insight = match.notes ?? getDefaultInsight(match);

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        Spēles nozīme
      </p>

      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg">
          🔥
        </div>

        <div>
          <h2 className="text-lg font-semibold text-black">
            Ko šī spēle nozīmē?
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {insight}
          </p>
        </div>
      </div>
    </Card>
  );
}