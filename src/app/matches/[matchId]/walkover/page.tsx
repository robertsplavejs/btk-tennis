import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchService } from "@/services/createMatchService";

import { saveWalkover } from "./actions";

type WalkoverPageProps = {
  params: Promise<{
    matchId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function WalkoverPage({
  params,
  searchParams,
}: WalkoverPageProps) {
  const { matchId } = await params;
  const { error } = await searchParams;

  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.isAdmin) {
    redirect("/");
  }

  const matchService = await createMatchService();
  const match = await matchService.getMatchById(matchId);

  if (!match || !match.player_one || !match.player_two) {
    notFound();
  }

  const saveWalkoverForMatch =
    saveWalkover.bind(null, matchId);

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href={`/matches/${matchId}`}
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz spēli
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-black">
          Tehniskā uzvara
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Izvēlies spēlētāju, kuram piešķirt uzvaru bez
          izspēlēta rezultāta.
        </p>
      </div>

      {error && (
        <p
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Izvēlies uzvarētāju
        </h2>

        <form
          action={saveWalkoverForMatch}
          className="mt-4 space-y-3"
        >
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 p-4">
            <input
              type="radio"
              name="winnerId"
              value={match.player_one_id}
              required
            />

            <span className="font-semibold text-black">
              {match.player_one.full_name}
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 p-4">
            <input
              type="radio"
              name="winnerId"
              value={match.player_two_id}
              required
            />

            <span className="font-semibold text-black">
              {match.player_two.full_name}
            </span>
          </label>

          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Spēle tiks ieskaitīta tabulā kā uzvara un
            zaudējums, bet setu un geimu statistikā rezultāts
            netiks pieskaitīts.
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Piešķirt tehnisko uzvaru
          </button>
        </form>
      </Card>
    </div>
  );
}
