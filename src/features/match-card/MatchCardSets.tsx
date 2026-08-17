import type { MatchCardTheme } from "./MatchCardTheme";
import type { MatchCardSet } from "./types";

type MatchCardSetsProps = {
  sets: MatchCardSet[];
  theme: MatchCardTheme;
};

export function MatchCardSets({
  sets,
  theme,
}: MatchCardSetsProps) {
  if (sets.length === 0) {
    return null;
  }

  return (
    <div className="px-6 pb-6">
      <div
        className="overflow-hidden rounded-3xl border"
        style={{
          borderColor: theme.border,
          background: theme.surface,
        }}
      >
        {sets.map((set, index) => (
          <div
            key={`${set.label}-${index}`}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-b-0"
            style={{
              borderColor: theme.border,
            }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: theme.secondaryText,
              }}
            >
              {set.label}
            </p>

            <p
              className="min-w-8 text-right text-base font-bold"
              style={{
                color: theme.primaryText,
              }}
            >
              {set.playerOneScore}
            </p>

            <p
              className="min-w-8 text-right text-base font-bold"
              style={{
                color: theme.primaryText,
              }}
            >
              {set.playerTwoScore}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}