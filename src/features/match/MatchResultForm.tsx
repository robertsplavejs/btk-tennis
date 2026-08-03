"use client";

import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/Card";
import { validateMatchSet } from "@/lib/validateMatchSet";
import type { MatchPlayer, MatchSet } from "@/types/match";

type MatchResultFormProps = {
  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;
};

type SetInput = {
  playerOneGames: string;
  playerTwoGames: string;
};

type DecidingSetType = "regular" | "match-tiebreak";

const emptySet: SetInput = {
  playerOneGames: "",
  playerTwoGames: "",
};

function parseScore(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function getSetWinner(set: SetInput) {
  const playerOneGames = parseScore(set.playerOneGames);
  const playerTwoGames = parseScore(set.playerTwoGames);

  if (
    playerOneGames === null ||
    playerTwoGames === null ||
    playerOneGames === playerTwoGames
  ) {
    return null;
  }

  return playerOneGames > playerTwoGames ? "playerOne" : "playerTwo";
}

function toMatchSet(set: SetInput): MatchSet | null {
  const playerOneGames = parseScore(set.playerOneGames);
  const playerTwoGames = parseScore(set.playerTwoGames);

  if (playerOneGames === null || playerTwoGames === null) {
    return null;
  }

  return {
    playerOneGames,
    playerTwoGames,
  };
}

export function MatchResultForm({
  playerOne,
  playerTwo,
}: MatchResultFormProps) {
  const [sets, setSets] = useState<SetInput[]>([
    { ...emptySet },
    { ...emptySet },
  ]);

  const [decidingSetType, setDecidingSetType] =
    useState<DecidingSetType>("match-tiebreak");

  const [message, setMessage] = useState<string | null>(null);

  const setWins = useMemo(() => {
    return sets.reduce(
      (result, set) => {
        const winner = getSetWinner(set);

        if (winner) {
          result[winner] += 1;
        }

        return result;
      },
      {
        playerOne: 0,
        playerTwo: 0,
      }
    );
  }, [sets]);

  const winner =
    setWins.playerOne >= 2
      ? playerOne
      : setWins.playerTwo >= 2
        ? playerTwo
        : null;

  function updateSet(
    setIndex: number,
    player: "playerOneGames" | "playerTwoGames",
    value: string
  ) {
    if (value !== "" && !/^\d{1,2}$/.test(value)) {
      return;
    }

    setSets((currentSets) =>
      currentSets.map((set, index) =>
        index === setIndex
          ? {
              ...set,
              [player]: value,
            }
          : set
      )
    );

    setMessage(null);
  }

  function addDecidingSet() {
    if (sets.length >= 3) {
      return;
    }

    setSets((currentSets) => [...currentSets, { ...emptySet }]);
    setMessage(null);
  }

  function removeDecidingSet() {
    setSets((currentSets) => currentSets.slice(0, 2));
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formattedSets = sets.map(toMatchSet);

    if (!formattedSets[0] || !formattedSets[1]) {
      setMessage("Ievadi pirmo divu setu rezultātus.");
      return;
    }

    const firstSetValidation = validateMatchSet(
      formattedSets[0],
      "regular"
    );

    if (!firstSetValidation.valid) {
      setMessage(`1. sets: ${firstSetValidation.message}`);
      return;
    }

    const secondSetValidation = validateMatchSet(
      formattedSets[1],
      "regular"
    );

    if (!secondSetValidation.valid) {
      setMessage(`2. sets: ${secondSetValidation.message}`);
      return;
    }

    const firstSetWinner = getSetWinner(sets[0]);
    const secondSetWinner = getSetWinner(sets[1]);
    const decidingSetIsRequired =
      firstSetWinner !== null &&
      secondSetWinner !== null &&
      firstSetWinner !== secondSetWinner;

    if (decidingSetIsRequired && sets.length < 3) {
      setMessage(
        "Setu rezultāts ir 1:1. Pievieno 3. setu vai mača taibreiku."
      );
      return;
    }

    if (sets.length === 3) {
      const decidingSet = formattedSets[2];

      if (!decidingSet) {
        setMessage("Ievadi izšķirošā seta rezultātu.");
        return;
      }

      const decidingSetValidation = validateMatchSet(
        decidingSet,
        decidingSetType
      );

      if (!decidingSetValidation.valid) {
        setMessage(
          `Izšķirošais sets: ${decidingSetValidation.message}`
        );
        return;
      }
    }

    if (!winner) {
      setMessage(
        "No ievadītā rezultāta nevar noteikt spēles uzvarētāju."
      );
      return;
    }

    const completedSets = formattedSets.filter(
      (set): set is MatchSet => set !== null
    );

    console.log({
      sets: completedSets,
      decidingSetType:
        sets.length === 3 ? decidingSetType : undefined,
      winnerId: winner.id,
    });

    setMessage(
      `Rezultāts sagatavots. Uzvarētājs: ${winner.name}.`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
            Rezultāts pa setiem
          </p>

          <h2 className="mt-1 text-lg font-semibold text-black">
            {playerOne.name} pret {playerTwo.name}
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {sets.map((set, index) => {
            const isDecidingSet = index === 2;

            return (
              <div
                key={`set-${index}`}
                className="rounded-2xl bg-neutral-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-black">
                    {isDecidingSet
                      ? decidingSetType === "match-tiebreak"
                        ? "Mača taibreiks"
                        : "3. sets"
                      : `${index + 1}. sets`}
                  </p>

                  {isDecidingSet && (
                    <button
                      type="button"
                      onClick={removeDecidingSet}
                      className="text-xs font-semibold text-neutral-500 transition hover:text-black"
                    >
                      Noņemt
                    </button>
                  )}
                </div>

                {isDecidingSet && (
                  <div className="mt-3 grid grid-cols-2 rounded-xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setDecidingSetType("regular")
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        decidingSetType === "regular"
                          ? "bg-black text-white"
                          : "text-neutral-500"
                      }`}
                    >
                      Pilns 3. sets
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDecidingSetType("match-tiebreak")
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        decidingSetType === "match-tiebreak"
                          ? "bg-black text-white"
                          : "text-neutral-500"
                      }`}
                    >
                      Taibreiks līdz 10
                    </button>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-[1fr_56px_20px_56px_1fr] items-center gap-2">
                  <p className="truncate text-right text-xs font-medium text-neutral-500">
                    {playerOne.name}
                  </p>

                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label={`${playerOne.name}, ${index + 1}. seta rezultāts`}
                    value={set.playerOneGames}
                    onChange={(event) =>
                      updateSet(
                        index,
                        "playerOneGames",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-black/10 bg-white text-center text-lg font-semibold outline-none transition focus:border-black"
                  />

                  <span className="text-center text-lg font-semibold text-neutral-400">
                    :
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label={`${playerTwo.name}, ${index + 1}. seta rezultāts`}
                    value={set.playerTwoGames}
                    onChange={(event) =>
                      updateSet(
                        index,
                        "playerTwoGames",
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-black/10 bg-white text-center text-lg font-semibold outline-none transition focus:border-black"
                  />

                  <p className="truncate text-xs font-medium text-neutral-500">
                    {playerTwo.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {sets.length === 2 && (
        <button
          type="button"
          onClick={addDecidingSet}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Pievienot 3. setu vai mača taibreiku
        </button>
      )}

      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Setu rezultāts
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="truncate text-sm font-medium text-black">
            {playerOne.name}
          </span>

          <span className="text-lg font-bold text-black">
            {setWins.playerOne}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="truncate text-sm font-medium text-black">
            {playerTwo.name}
          </span>

          <span className="text-lg font-bold text-black">
            {setWins.playerTwo}
          </span>
        </div>

        {winner && (
          <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            Uzvarētājs: {winner.name}
          </p>
        )}
      </Card>

      {message && (
        <p
          className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-5 text-neutral-700"
          role="status"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
      >
        Saglabāt rezultātu
      </button>
    </form>
  );
}