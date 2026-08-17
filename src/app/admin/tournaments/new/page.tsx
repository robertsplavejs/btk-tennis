import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { createSeasonService } from "@/services/createSeasonService";

import { createTournament } from "../actions";

type NewTournamentPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewTournamentPage({
  searchParams,
}: NewTournamentPageProps) {
  const { error } = await searchParams;

  const seasonService = await createSeasonService();
  const seasons = await seasonService.getSeasons();

  const activeSeason =
    seasons.find((season) => season.is_active) ?? seasons[0];

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href="/admin/tournaments"
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz turnīriem
        </Link>

        <p className="mt-5 text-sm text-neutral-500">
          BTK administrācija
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Jauns turnīrs
        </h1>
      </div>

      {seasons.length === 0 ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Vispirms izveido sezonu
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Katram turnīram jābūt piesaistītam sezonai.
          </p>

          <Link
            href="/admin/seasons/new"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
          >
            Izveidot sezonu
          </Link>
        </Card>
      ) : (
        <Card className="p-5">
          <form action={createTournament} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-black">
                Sezona
              </span>

              <select
                name="seasonId"
                required
                defaultValue={activeSeason?.id}
                className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
              >
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                    {season.is_active ? " — aktīvā" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-black">
                Turnīra nosaukums
              </span>

              <input
                type="text"
                name="name"
                required
                minLength={2}
                placeholder="Piemēram, Vīrieši A"
                className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
              />
            </label>

            {error && (
              <p
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
            >
              Izveidot turnīru
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}