import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const sections = [
  {
    href: "/admin/invitations",
    title: "Konti un uzaicinājumi",
    description:
      "Piesaisti spēlētājus viņu profiliem un izveido administratoru kontus.",
  },
  {
    href: "/admin/seasons",
    title: "Sezonas",
    description: "Pārvaldi BTK sezonas un to statusu.",
  },
  {
    href: "/admin/tournaments",
    title: "Turnīri",
    description: "Pārvaldi turnīrus, dalībniekus un spēles.",
  },
];

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-neutral-500">BTK administrācija</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Administrēšana
        </h1>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="p-5 transition hover:border-black/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    {section.description}
                  </p>
                </div>
                <span aria-hidden="true" className="text-neutral-400">
                  →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Link
        href="/account/password"
        className="block py-3 text-center text-sm font-semibold text-neutral-500"
      >
        Mainīt savu paroli
      </Link>
    </div>
  );
}
