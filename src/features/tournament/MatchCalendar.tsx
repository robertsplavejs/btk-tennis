import Link from "next/link";
import clsx from "clsx";

import { Card } from "@/components/ui/Card";
import { formatMatchScore } from "@/lib/formatMatchScore";
import type { MatchFormResult, TournamentMatch } from "@/types/match";

type MatchCalendarProps = {
  matches: TournamentMatch[];
  currentPlayerId: string;
};

type MatchSectionProps = {
  title: string;
  matches: TournamentMatch[];
  currentPlayerId: string;
  variant?: "default" | "featured";
  emptyMessage: string;
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
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function FormDots({ results = [] }: { results?: MatchFormResult[] }) {
  if (results.length === 0) {
    return (
      <span className="text-xs text-neutral-400">
        Forma nav pieejama
      </span>
    );
  }

  return (
    <div
      className="flex items-center gap-1"
      aria-label="Pretinieka pēdējo spēļu forma"
    >
      {results.slice(-5).map((result, index) => (
        <span
          key={`${result}-${index}`}
          title={result === "win" ? "Uzvara" : "Zaudējums"}
          className={clsx(
            "h-2.5 w-2.5 rounded-full",
            result === "win" ? "bg-green-500" : "bg-red-400"
          )}
        />
      ))}
    </div>
  );
}

function MatchRow({
  match,
  currentPlayerId,
  featured = false,
}: {
  match: TournamentMatch;
  currentPlayerId: string;
  featured?: boolean;
}) {
  const opponent =
    match.playerOne.id === currentPlayerId
      ? match.playerTwo
      : match.playerOne;

  return (
    <article
      className={clsx(
        "border-b border-black/5 py-4 last:border-b-0",
        featured && "py-5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              "truncate font-semibold text-black",
              featured ? "text-lg" : "text-sm"
            )}
          >
            pret {opponent.name}
          </p>

          {match.status === "scheduled" && (
            <div className="mt-2 space-y-1 text-sm text-neutral-500">
              <p className="capitalize">
                {formatScheduledDate(match.scheduledAt)}
              </p>

              {match.court && <p>{match.court}</p>}

              {match.location && <p>{match.location}</p>}
            </div>
          )}

          {match.status === "completed" && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-black">
                {formatMatchScore(match)}
              </p>

              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-500">
                Pabeigta
              </span>
            </div>
          )}

          {match.status === "unscheduled" && (
            <div className="mt-2">
              <p className="text-sm text-neutral-500">
                Laiks vēl nav saskaņots
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-neutral-400">
                  Pretinieka forma
                </span>

                <FormDots results={opponent.recentForm} />
              </div>
            </div>
          )}

          {match.status === "cancelled" && (
            <p className="mt-2 text-sm text-red-600">
              Spēle atcelta
            </p>
          )}
        </div>

        {match.status === "scheduled" && (
          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Ieplānota
          </span>
        )}
      </div>

      {featured && match.status === "scheduled" && (
        <Link
          href={`/matches/${match.id}`}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Skatīt spēli
        </Link>
      )}
    </article>
  );
}

function MatchSection({
  title,
  matches,
  currentPlayerId,
  variant = "default",
  emptyMessage,
}: MatchSectionProps) {
  return (
    <Card
      className={clsx(
        "p-5",
        variant === "featured" && "border-black/10"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          className={clsx(
            "font-semibold text-black",
            variant === "featured" ? "text-xl" : "text-lg"
          )}
        >
          {title}
        </h2>

        <span className="text-xs font-medium text-neutral-400">
          {matches.length}
        </span>
      </div>

      {matches.length > 0 ? (
        <div className="mt-3">
          {matches.map((match, index) => (
            <MatchRow
              key={match.id}
              match={match}
              currentPlayerId={currentPlayerId}
              featured={variant === "featured" && index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
          {emptyMessage}
        </p>
      )}
    </Card>
  );
}

export function MatchCalendar({
  matches,
  currentPlayerId,
}: MatchCalendarProps) {
  const scheduledMatches = matches.filter(
    (match) => match.status === "scheduled"
  );

  const completedMatches = matches.filter(
    (match) => match.status === "completed"
  );

  const unscheduledMatches = matches.filter(
    (match) => match.status === "unscheduled"
  );

  return (
    <div className="space-y-4">
      <MatchSection
        title="Nākamās spēles"
        matches={scheduledMatches}
        currentPlayerId={currentPlayerId}
        variant="featured"
        emptyMessage="Pašlaik neviena nākamā spēle nav ieplānota."
      />

      <MatchSection
        title="Izspēlētās spēles"
        matches={completedMatches}
        currentPlayerId={currentPlayerId}
        emptyMessage="Vēl nav izspēlētu spēļu."
      />

      <MatchSection
        title="Neizspēlētās spēles"
        matches={unscheduledMatches}
        currentPlayerId={currentPlayerId}
        emptyMessage="Visas turnīra spēles jau ir ieplānotas vai izspēlētas."
      />
    </div>
  );
}