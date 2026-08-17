import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { createClubService } from "@/services/createClubService";

import { createSeason } from "../actions";

type NewSeasonPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewSeasonPage({
  searchParams,
}: NewSeasonPageProps) {
  const { error } = await searchParams;

  const clubService = await createClubService();
  const club = await clubService.getClubBySlug("btk");

  if (!club) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <Link
            href="/admin/seasons"
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Atpakaļ uz sezonām
          </Link>

          <p className="mt-5 text-sm text-neutral-500">
            BTK administrācija
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Klubs nav atrasts
          </h1>
        </div>

        <Card className="p-5">
          <p className="text-sm leading-6 text-neutral-500">
            Datubāzē vēl nav izveidots klubs ar identifikatoru
            <span className="font-semibold text-black"> btk</span>.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href="/admin/seasons"
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz sezonām
        </Link>

        <p className="mt-5 text-sm text-neutral-500">
          {club.name} administrācija
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Jauna sezona
        </h1>
      </div>

      <Card className="p-5">
        <form action={createSeason} className="space-y-5">
          <input
            type="hidden"
            name="clubId"
            value={club.id}
          />

          <label className="block">
            <span className="text-sm font-medium text-black">
              Sezonas nosaukums
            </span>

            <input
              type="text"
              name="name"
              required
              placeholder="Piemēram, 2026 Rudens"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-black">
                Sākuma datums
              </span>

              <input
                type="date"
                name="startsOn"
                className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-black">
                Beigu datums
              </span>

              <input
                type="date"
                name="endsOn"
                className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
            <input
              type="checkbox"
              name="isActive"
              className="mt-1 h-4 w-4 rounded border-black/20"
            />

            <span>
              <span className="block text-sm font-semibold text-black">
                Atzīmēt kā aktīvo sezonu
              </span>

              <span className="mt-1 block text-sm leading-5 text-neutral-500">
                Aktīvā sezona tiks izmantota kā galvenā administrācijas skatā.
              </span>
            </span>
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
            Izveidot sezonu
          </button>
        </form>
      </Card>
    </div>
  );
}