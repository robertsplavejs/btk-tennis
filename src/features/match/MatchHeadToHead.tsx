import { Card } from "@/components/ui/Card";
import { formatMatchScore } from "@/lib/formatMatchScore";
import type { TournamentMatch } from "@/types/match";

type MatchHeadToHeadProps = {
  currentMatch: TournamentMatch;
  allMatches: TournamentMatch[];
};

function hasSamePlayers(
  match: TournamentMatch,
  playerOneId: string,
  playerTwoId: string
) {
  return (
    (match.playerOne.id === playerOneId &&
      match.playerTwo.id === playerTwoId) ||
    (match.playerOne.id === playerTwoId &&
      match.playerTwo.id === playerOneId)
  );
}

export function MatchHeadToHead({
  currentMatch,
  allMatches,
}: MatchHeadToHeadProps) {
  const playerOne = currentMatch.playerOne;
  const playerTwo = currentMatch.playerTwo;

  const completedMeetings = allMatches
    .filter(
      (match) =>
        match.id !== currentMatch.id &&
        match.status === "completed" &&
        hasSamePlayers(match, playerOne.id, playerTwo.id)
    )
    .sort((firstMatch, secondMatch) => {
      const firstDate = new Date(
        firstMatch.updatedAt ?? firstMatch.createdAt ?? 0
      ).getTime();

      const secondDate = new Date(
        secondMatch.updatedAt ?? secondMatch.createdAt ?? 0
      ).getTime();

      return secondDate - firstDate;
    });

  const playerOneWins = completedMeetings.filter(
    (match) => match.winnerId === playerOne.id
  ).length;

  const playerTwoWins = completedMeetings.filter(
    (match) => match.winnerId === playerTwo.id
  ).length;

  const latestMeeting = completedMeetings[0];

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        Savstarpējās spēles
      </p>

      <h2 className="mt-1 text-lg font-semibold text-black">
        Head-to-head
      </h2>

      {completedMeetings.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
          Šī būs spēlētāju pirmā savstarpējā spēle.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold text-black">
                {playerOne.name}
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight text-black">
                {playerOneWins}
              </p>
            </div>

            <span className="text-xl font-semibold text-neutral-300">
              :
            </span>

            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold text-black">
                {playerTwo.name}
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight text-black">
                {playerTwoWins}
              </p>
            </div>
          </div>

          {latestMeeting && (
            <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Pēdējā savstarpējā spēle
              </p>

              <p className="mt-2 text-sm font-semibold text-black">
                {formatMatchScore(latestMeeting)}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Uzvarēja{" "}
                {latestMeeting.winnerId === playerOne.id
                  ? playerOne.name
                  : playerTwo.name}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}