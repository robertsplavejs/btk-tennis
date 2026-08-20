import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ActivityFeed } from "@/features/activity/ActivityFeed";
import { HomeHeroCard } from "@/features/home/components/HomeHeroCard";
import { HomeNextMatchCard } from "@/features/home/components/HomeNextMatchCard";
import { HomeInsightCard } from "@/features/home/components/HomeInsightCard";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createActivityViewService } from "@/services/createActivityViewService";
import { createPlayerProfileViewService } from "@/services/createPlayerProfileViewService";
import type { TournamentMatch } from "@/types/match";

function getOpponent(
  match: TournamentMatch,
  playerId: string
) {
  return match.playerOne.id === playerId
    ? match.playerTwo
    : match.playerOne;
}

export async function HomeScreen() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return <VisitorHomeScreen />;
  }

  if (!identity.playerId) {
    if (identity.isAdmin) {
      redirect("/admin");
    }

    return <AccountPendingScreen />;
  }

  const [
    playerProfileViewService,
    activityViewService,
  ] = await Promise.all([
    createPlayerProfileViewService(),
    createActivityViewService(),
  ]);

  const [profile, activities] = await Promise.all([
    playerProfileViewService.getProfileView(identity.playerId),
    activityViewService.getLatestActivityCards(6),
  ]);

  const nextOpponent = profile.nextMatch
    ? getOpponent(
        profile.nextMatch,
        profile.player.id
      )
    : null;

  const pendingResultOpponent =
    profile.pendingResultMatch
      ? getOpponent(
          profile.pendingResultMatch,
          profile.player.id
        )
      : null;

  return (
    <div
      className="px-4 pb-6 pt-4"
      style={{ display: "grid", gap: 18 }}
    >
      <HomeHeroCard
        fullName={profile.player.fullName}
        initials={profile.player.initials}
        avatarUrl={profile.player.avatarUrl}
        position={profile.tournament?.position ?? null}
        points={profile.tournament?.points ?? 0}
        wins={profile.statistics.wins}
        losses={profile.statistics.losses}
        played={profile.tournament?.played ?? 0}
        totalMatches={
          profile.tournament?.totalMatches ?? 0
        }
        currentForm={profile.statistics.currentForm}
      />

      <HomeNextMatchCard
        matchId={profile.nextMatch?.id ?? null}
        opponentName={nextOpponent?.name ?? null}
        opponentAvatarUrl={nextOpponent?.avatarUrl ?? null}
        scheduledAt={
          profile.nextMatch?.scheduledAt
        }
        location={profile.nextMatch?.location}
        court={profile.nextMatch?.court}
        pendingResultMatchId={
          profile.pendingResultMatch?.id ?? null
        }
        pendingResultOpponentName={
          pendingResultOpponent?.name ?? null
        }
        unscheduledMatchCount={
          profile.unscheduledMatches.length
        }
        hasCompletedAllMatches={Boolean(
          profile.tournament &&
          profile.tournament.totalMatches > 0 &&
          profile.statistics.played >=
            profile.tournament.totalMatches
        )}
      />

      {profile.primaryInsight ? (
        <HomeInsightCard insight={profile.primaryInsight} />
      ) : null}

      <ActivityFeed
        activities={activities}
        title="Kluba aktivitātes"
      />
    </div>
  );
}

function AccountPendingScreen() {
  return (
    <div className="px-4 pb-7 pt-4">
      <section className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
          Konta aktivizēšana
        </p>
        <h1 className="mt-2 text-2xl font-black text-neutral-950">
          Profils vēl nav piesaistīts
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Administrators vēl nav piesaistījis šo kontu spēlētāja profilam.
        </p>
      </section>
    </div>
  );
}

function VisitorHomeScreen() {
  return (
    <div className="grid gap-[18px] px-4 pb-7 pt-4">
      <section className="relative overflow-hidden rounded-[28px] bg-[#07131f] px-6 py-8 text-white shadow-[0_14px_34px_rgba(7,19,31,0.16)]">
        <Image
          src="/demo/home-hero-dark.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            Bīriņa Tenisa Klubs
          </p>
          <h1 className="mt-5 max-w-[270px] text-[30px] font-black uppercase leading-[1.05] tracking-[-0.025em]">
            BTK turnīri vienuviet
          </h1>
          <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/65">
            Apskati aktuālo turnīru tabulas, statistiku un spēļu rezultātus.
          </p>
        </div>
      </section>

      <Link
        href="/tournament"
        className="flex min-h-20 items-center justify-between rounded-[24px] border border-black/5 bg-white px-5 shadow-[0_5px_18px_rgba(15,23,42,0.045)]"
      >
        <span>
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
            Publiski pieejams
          </span>
          <span className="mt-1 block text-lg font-black text-neutral-950">
            Skatīt turnīrus
          </span>
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-lg text-neutral-500" aria-hidden="true">
          →
        </span>
      </Link>

      <section className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
          Spēlētājiem
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Ielogojies, lai redzētu savas spēles, paziņojumus un personīgo statistiku.
        </p>
        <Link
          href="/login"
          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-[#30363d] text-sm font-bold text-white"
        >
          Ielogoties
        </Link>
      </section>
    </div>
  );
}
