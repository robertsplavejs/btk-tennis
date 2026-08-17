import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { createParticipantService } from "@/services/createParticipantService";
import { createPlayerService } from "@/services/createPlayerService";

import {
  addParticipants,
  removeParticipant,
} from "./actions";

type ParticipantsPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;

  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ParticipantsPage({
  params,
  searchParams,
}: ParticipantsPageProps) {
  const { tournamentId } = await params;
  const { error, success } = await searchParams;

  const playerService = await createPlayerService();
  const participantService =
    await createParticipantService();

  const [players, participants] = await Promise.all([
    playerService.getPlayers(),
    participantService.getParticipants(tournamentId),
  ]);

  const participantPlayerIds = new Set(
    participants.map(
      (participant) => participant.player_id
    )
  );

  const availablePlayers = players.filter(
    (player) => !participantPlayerIds.has(player.id)
  );

  const addParticipantsForTournament =
    addParticipants.bind(null, tournamentId);

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href={`/admin/tournaments/${tournamentId}`}
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz turnīru
        </Link>

        <p className="mt-5 text-sm text-neutral-500">
          Turnīrs
        </p>

        <h1 className="mt-1 text-3xl font-bold text-black">
          Dalībnieki
        </h1>
      </div>

      {success && (
        <p
          className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
          role="status"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-black">
              Turnīra dalībnieki
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Pašlaik pievienoti {participants.length}
            </p>
          </div>
        </div>

        {participants.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
            Turnīram vēl nav pievienots neviens dalībnieks.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {participants.map((participant) => {
              const removeParticipantFromTournament =
                removeParticipant.bind(
                  null,
                  tournamentId,
                  participant.player_id
                );

              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-black/5 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-black">
                      {participant.player?.initials ?? "—"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-black">
                        {participant.player?.full_name ??
                          "Nezināms spēlētājs"}
                      </p>

                      <p className="text-sm text-neutral-500">
                        Dalībnieks
                      </p>
                    </div>
                  </div>

                  <form action={removeParticipantFromTournament}>
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Noņemt
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-black">
              Pievienot spēlētājus
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Pieejami {availablePlayers.length}
            </p>
          </div>
        </div>

        {availablePlayers.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
            Visi sistēmā esošie spēlētāji jau ir pievienoti
            turnīram.
          </p>
        ) : (
          <form
            action={addParticipantsForTournament}
            className="mt-4"
          >
            <div className="space-y-2">
              {availablePlayers.map((player) => (
                <label
                  key={player.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 transition hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    name="playerIds"
                    value={player.id}
                    className="h-4 w-4 rounded border-black/20"
                  />

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-black">
                    {player.initials ?? "—"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-black">
                      {player.full_name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      Kluba spēlētājs
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
            >
              Pievienot izvēlētos turnīram
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}