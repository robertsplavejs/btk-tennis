/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { MatchTimeline } from "@/features/match/MatchTimeline";
import { createMatchViewService } from "@/services/createMatchViewService";
import { getPlayerAvatarUrl } from "@/lib/getPlayerAvatarUrl";
import { MatchNotFoundError } from "@/services/MatchViewService";

type MatchScreenProps = {
  matchId: string;
};

function formatScheduledAt(value: string | null) {
  if (!value) {
    return "Nav ieplānots";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Nav ieplānots";
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function MatchPlayer({
  player,
}: {
  player: {
    id: string;
    full_name: string;
    initials: string | null;
    avatar_url: string | null;
  };
}) {
  const avatarUrl = getPlayerAvatarUrl(
    player.full_name,
    player.avatar_url
  );
  const [firstName, ...surnameParts] = player.full_name
    .trim()
    .split(/\s+/);
  const surname = surnameParts.join(" ");

  return (
    <Link
      href={`/players/${player.id}`}
      className="min-w-0 text-center text-white no-underline"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={player.full_name}
          className="mx-auto h-20 w-20 rounded-full border-2 border-white/90 object-cover shadow-lg"
        />
      ) : (
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-white/90 bg-white/10 text-lg font-black text-white shadow-lg">
          {player.initials ?? "—"}
        </span>
      )}
      <span className="mt-2 block min-h-[34px] overflow-hidden text-[13px] font-black uppercase leading-[17px]">
        <span className="block truncate">{firstName}</span>
        {surname ? <span className="block truncate">{surname}</span> : null}
      </span>
    </Link>
  );
}

export async function MatchScreen({
  matchId,
}: MatchScreenProps) {
  let matchView;

  try {
    const { service, currentUser } =
      await createMatchViewService();

    matchView = await service.getMatchView(
      matchId,
      currentUser
    );
  } catch (error) {
    if (error instanceof MatchNotFoundError) {
      notFound();
    }

    throw error;
  }

  const {
    match,
    timelineItems,
    currentUser,
  } = matchView;

  if (!match.player_one || !match.player_two) {
    notFound();
  }

  const isUnscheduled = match.status === "unscheduled";
  const isScheduled = match.status === "scheduled";
  const isCompleted = match.status === "completed";
  const isCancelled = match.status === "cancelled";

  const isWalkover =
    match.result_type === "walkover";

  const canManageMatch =
    currentUser?.canManageMatch ?? false;

  const isAdmin =
    currentUser?.isAdmin ?? false;

  return (
    <div className="space-y-4 p-4">
      <Card className="overflow-hidden border-0">
        <div className="relative min-h-[184px] overflow-hidden bg-[#07111d] px-6 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,255,0,0.13),transparent_48%)]" aria-hidden="true" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center gap-4">
            <MatchPlayer player={match.player_one} />

            <div className="text-center">
            {isWalkover ? (
              <div className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">
                WO
              </div>
            ) : isCompleted && match.sets.length > 0 ? (
              <div className="text-[9px] font-black uppercase tracking-[0.1em] text-white/55">
                Pabeigta
              </div>
            ) : (
              <p className="text-sm font-black text-white/55">
                VS
              </p>
            )}
            </div>

            <MatchPlayer player={match.player_two} />
          </div>
        </div>

        <div className="space-y-3 bg-white px-5 py-[18px]">
          <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
            <p className="text-xs font-medium text-neutral-400">
              Datums un laiks
            </p>

            <p className="mt-1 text-sm font-semibold text-black first-letter:uppercase">
              {formatScheduledAt(match.scheduled_at)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
              <p className="text-xs font-medium text-neutral-400">
                Vieta
              </p>

              <p className="mt-1 text-sm font-semibold text-black">
                {match.location ?? "Nav norādīta"}
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
              <p className="text-xs font-medium text-neutral-400">
                Korts
              </p>

              <p className="mt-1 text-sm font-semibold text-black">
                {match.court ?? "Nav norādīts"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {isCompleted && (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Rezultāts
          </h2>

          {isWalkover ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-900">
                WO · Tehniskā uzvara
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Spēle netika izspēlēta. Uzvara un
                zaudējums tiek ieskaitīti turnīra tabulā,
                bet setu un geimu statistika netiek mainīta.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {match.sets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3"
                >
                  <span className="text-sm text-neutral-500">
                    {set.set_type === "match_tiebreak"
                      ? "Supertaibreiks"
                      : `${set.set_number}. sets`}
                  </span>

                  <span className="text-base font-bold text-black">
                    {set.player_one_score}:
                    {set.player_two_score}
                  </span>
                </div>
              ))}
            </div>
          )}

          {match.winner && (
            <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              Uzvarētājs: {match.winner.full_name}
            </p>
          )}
        </Card>
      )}

      <MatchTimeline items={timelineItems} />

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Nākamā darbība
        </h2>

        {isUnscheduled && (
          <>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Vispirms vienojieties par spēles laiku un kortu.
              Rezultātu varēs ievadīt pēc spēles ieplānošanas.
            </p>

            {canManageMatch && (
              <Link
                href={`/matches/${match.id}/schedule`}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
              >
                Ieplānot spēli
              </Link>
            )}

            {isAdmin && (
              <Link
                href={`/matches/${match.id}/walkover`}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-amber-100 px-5 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
              >
                Piešķirt tehnisko uzvaru
              </Link>
            )}
          </>
        )}

        {isScheduled && (
          <>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Spēle ir ieplānota. Pēc tās izspēlēšanas ievadi
              rezultātu.
            </p>

            {canManageMatch && (
              <div className="mt-5 space-y-3">
                <Link
                  href={`/matches/${match.id}/result`}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
                >
                  Ievadīt rezultātu
                </Link>

                <Link
                  href={`/matches/${match.id}/schedule`}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
                >
                  Pārcelt spēli
                </Link>

                {isAdmin && (
                  <Link
                    href={`/matches/${match.id}/walkover`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-amber-100 px-5 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
                  >
                    Piešķirt tehnisko uzvaru
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {isCompleted && (
          <>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {isWalkover
                ? "Spēle pabeigta ar tehnisko uzvaru un ir ieskaitīta turnīra tabulā."
                : "Spēle ir pabeigta un rezultāts ir ieskaitīts turnīra tabulā."}
            </p>

            <div className="mt-5 space-y-3">
              {canManageMatch && (
                <Link
                  href={`/matches/${match.id}/result`}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
                >
                  {isWalkover
                    ? "Aizstāt ar spēles rezultātu"
                    : "Labot rezultātu"}
                </Link>
              )}

              {isAdmin && (
                <Link
                  href={`/matches/${match.id}/walkover`}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-amber-100 px-5 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
                >
                  Mainīt tehnisko uzvaru
                </Link>
              )}

              <Link
                href={`/matches/${match.id}/card`}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
              >
                Izveidot Match Card
              </Link>
            </div>
          </>
        )}

        {isCancelled && (
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Spēle ir atcelta. Lai to atjaunotu, nepieciešama
            administratora darbība.
          </p>
        )}
      </Card>
    </div>
  );
}
