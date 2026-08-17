import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createSeasonService } from "@/services/createSeasonService";

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "Nav norādīts";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Nav norādīts";
  }

  return new Intl.DateTimeFormat("lv-LV", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminSeasonsPage() {
  const seasonService = await createSeasonService();
  const seasons = await seasonService.getSeasons();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">
            BTK administrācija
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Sezonas
          </h1>
        </div>

        <Link
          href="/admin/seasons/new"
          className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--btk-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Jauna sezona
        </Link>
      </div>

      {seasons.length === 0 ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Vēl nav nevienas sezonas
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Izveido pirmo sezonu, lai pēc tam varētu pievienot turnīrus.
          </p>

          <Link
            href="/admin/seasons/new"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Izveidot sezonu
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {seasons.map((season) => (
            <Card key={season.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold text-black">
                      {season.name}
                    </h2>

                    {season.is_active && (
                      <Badge>Aktīva</Badge>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-neutral-500">
                    {formatDate(season.starts_on)} –{" "}
                    {formatDate(season.ends_on)}
                  </p>
                </div>

                <Link
                  href={`/admin/seasons/${season.id}`}
                  className="shrink-0 text-sm font-semibold text-[var(--btk-primary)]"
                >
                  Atvērt
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}