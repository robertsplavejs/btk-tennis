import type { MatchCardTheme } from "./MatchCardTheme";

type MatchCardScoreProps = {
  score: string;
  theme: MatchCardTheme;
};

export function MatchCardScore({
  score,
  theme,
}: MatchCardScoreProps) {
  return (
    <div className="px-6 pb-6">
      <div
        className="rounded-3xl px-5 py-6 text-center"
        style={{
          background: theme.accent,
          color: theme.accentText,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
          Spēles rezultāts
        </p>

        <p className="mt-2 text-5xl font-bold tracking-tight">
          {score}
        </p>
      </div>
    </div>
  );
}