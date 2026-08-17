import Image from "next/image";

import type { MatchCardTheme } from "./MatchCardTheme";

type MatchCardHeaderProps = {
  tournamentName: string;
  tournamentStage?: string;
  logoUrl?: string;
  theme: MatchCardTheme;
};

export function MatchCardHeader({
  tournamentName,
  tournamentStage,
  logoUrl,
  theme,
}: MatchCardHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 border-b px-6 py-5"
      style={{
        borderColor: theme.border,
      }}
    >
      <div className="min-w-0">
        <p
          className="truncate text-sm font-semibold"
          style={{
            color: theme.primaryText,
          }}
        >
          {tournamentName}
        </p>

        {tournamentStage && (
          <p
            className="mt-1 text-xs font-medium uppercase tracking-[0.14em]"
            style={{
              color: theme.secondaryText,
            }}
          >
            {tournamentStage}
          </p>
        )}
      </div>

      {logoUrl ? (
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={logoUrl}
            alt="Turnīra logo"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: theme.accent,
            color: theme.accentText,
          }}
        >
          BTK
        </div>
      )}
    </div>
  );
}