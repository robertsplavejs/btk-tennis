import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

import { createInvitation } from "./actions";
import { CopyInvitationLink } from "./CopyInvitationLink";

type InvitationsPageProps = {
  searchParams: Promise<{
    error?: string;
    token?: string;
    name?: string;
  }>;
};

export default async function InvitationsPage({
  searchParams,
}: InvitationsPageProps) {
  await requireAdmin();
  const { error, token } = await searchParams;
  const supabase = await createClient();

  const [{ data: players }, { data: accounts }, { data: invitations }] =
    await Promise.all([
      supabase.from("players").select("id, full_name").order("full_name"),
      supabase.from("user_accounts").select("player_id"),
      supabase
        .from("account_invitations")
        .select("id, email, display_name, is_admin, accepted_at, expires_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const linkedPlayerIds = new Set(
    (accounts ?? []).flatMap((account) =>
      account.player_id ? [account.player_id] : []
    )
  );
  const availablePlayers = (players ?? []).filter(
    (player) => !linkedPlayerIds.has(player.id)
  );

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link href="/admin" className="text-sm font-medium text-neutral-500">
          ← Atpakaļ uz administrēšanu
        </Link>
        <p className="mt-5 text-sm text-neutral-500">BTK administrācija</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Kontu uzaicinājumi
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Spēlētājam izvēlies viņa esošo profilu. Administratoram, kurš
          nespēlē turnīros, izveido atsevišķu administratora kontu.
        </p>
      </div>

      {token && (
        <Card className="border-green-200 bg-green-50 p-5">
          <h2 className="font-semibold text-green-900">Uzaicinājums gatavs</h2>
          <p className="mt-2 text-sm leading-6 text-green-800">
            Nokopē saiti un nosūti to uzaicinātajai personai. Saite ir derīga
            14 dienas un izmantojama vienu reizi.
          </p>
          <CopyInvitationLink path={`/register?token=${token}`} />
        </Card>
      )}

      <Card className="p-5">
        <form action={createInvitation} className="space-y-5">
          <fieldset>
            <legend className="text-sm font-medium text-black">Konta veids</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="rounded-xl border border-black/10 p-3 text-sm">
                <input type="radio" name="accountType" value="player" defaultChecked />{" "}
                Spēlētājs
              </label>
              <label className="rounded-xl border border-black/10 p-3 text-sm">
                <input type="radio" name="accountType" value="admin" />{" "}
                Tikai administrators
              </label>
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium text-black">Spēlētāja profils</span>
            <select
              name="playerId"
              defaultValue=""
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm"
            >
              <option value="">Izvēlies spēlētāju</option>
              {availablePlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.full_name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">
              Administratora vārds (ja nav spēlētājs)
            </span>
            <input
              type="text"
              name="displayName"
              placeholder="Piemēram, Līga Bīriņa"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">E-pasts</span>
            <input
              type="email"
              name="email"
              required
              className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-black">
            <input type="checkbox" name="isAdmin" />
            Piešķirt administratora tiesības arī spēlētājam
          </label>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white">
            Izveidot uzaicinājumu
          </button>
        </form>
      </Card>

      {invitations && invitations.length > 0 && (
        <Card className="divide-y divide-black/5 overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-black">Pēdējie uzaicinājumi</h2>
          </div>
          {invitations.map((invitation) => (
            <div key={invitation.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-black">{invitation.display_name}</p>
                  <p className="truncate text-sm text-neutral-500">{invitation.email}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {invitation.accepted_at ? "Pieņemts" : "Gaida"}
                </span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
