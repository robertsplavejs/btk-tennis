import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";

type HomeTournamentProgressCardProps = {
  tournamentName: string | null;
  played: number;
  totalMatches: number;
};

export function HomeTournamentProgressCard({
  tournamentName,
  played,
  totalMatches,
}: HomeTournamentProgressCardProps) {
  const progress =
    totalMatches > 0
      ? Math.min(
          Math.round((played / totalMatches) * 100),
          100
        )
      : 0;

  return (
    <Card className="p-5">
      <SectionHeader
        title="Turnīra progress"
        subtitle={
          tournamentName ??
          "Pašlaik nav aktīva turnīra"
        }
        action={
          tournamentName ? (
            <Link
              href="/tournament"
              className="text-sm font-semibold text-[var(--btk-primary)]"
            >
              Atvērt →
            </Link>
          ) : undefined
        }
      />

      {tournamentName && (
        <div className="mt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-black">
                {played} / {totalMatches}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                nospēlētas spēles
              </p>
            </div>

            <p className="text-lg font-bold text-black">
              {progress}%
            </p>
          </div>

          <ProgressBar
            value={progress}
            className="mt-4"
          />
        </div>
      )}
    </Card>
  );
}