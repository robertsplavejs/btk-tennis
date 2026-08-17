/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";
import type { MatchFormResult } from "@/types/match";

type HomeHeroTheme = "dark" | "clay" | "grass" | "hard";

type HomeHeroCardProps = {
  fullName: string;
  initials: string;
  avatarUrl: string | null;
  position: number | null;
  points: number;
  wins: number;
  losses: number;
  played: number;
  totalMatches: number;
  currentForm: MatchFormResult[];
};

type ActiveHomeHeroTheme = Extract<HomeHeroTheme, "dark">;

const ACTIVE_HOME_HERO_THEME: ActiveHomeHeroTheme = "dark";

const HOME_HERO_THEMES: Record<
  ActiveHomeHeroTheme,
  {
    backgroundImage: string;
    backgroundColor: string;
    accentColor: string;
  }
> = {
  dark: {
    backgroundImage: "/demo/home-hero-dark.png",
    backgroundColor: "#050b10",
    accentColor: "#c7ff00",
  },
};

export function HomeHeroCard({
  fullName,
  avatarUrl,
  position,
  points,
  wins,
  losses,
  played,
  totalMatches,
  currentForm,
}: HomeHeroCardProps) {
  const progress =
    totalMatches > 0
      ? Math.min(Math.round((played / totalMatches) * 100), 100)
      : 0;

  const theme = HOME_HERO_THEMES[ACTIVE_HOME_HERO_THEME];
  const resolvedAvatarUrl = avatarUrl ?? "/demo/roberts.jpg";

  return (
    <Link
      href="/profile"
      className="block"
      aria-label={`Atvērt ${fullName} profilu`}
    >
      <Card
        className="overflow-hidden border-0 transition active:scale-[0.995]"
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0 18px 42px rgba(2, 8, 18, 0.22)",
        }}
      >
        <div
          className="relative overflow-hidden text-white"
          style={{
            width: "100%",
            aspectRatio: "1.82 / 1",
            backgroundColor: theme.backgroundColor,
          }}
        >
        <img
          src={theme.backgroundImage}
          alt=""
          className="pointer-events-none h-full w-full object-cover object-center"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.9,
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(90deg, rgba(3, 8, 12, 0.7) 0%, rgba(3, 8, 12, 0.3) 46%, rgba(3, 8, 12, 0.08) 100%)",
          }}
          aria-hidden="true"
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
          }}
        >
          <div
            className="grid items-center gap-4"
            style={{
              position: "absolute",
              top: "8%",
              left: "5%",
              right: "5%",
              height: "34%",
              gridTemplateColumns: "minmax(64px, 19%) minmax(0, 1fr) 24px",
            }}
          >
            <img
              src={resolvedAvatarUrl}
              alt={fullName}
              className="h-full max-h-[96px] w-auto max-w-full rounded-full border border-white/30 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
              style={{
                aspectRatio: "1 / 1",
                borderRadius: "50%",
              }}
            />

            <div className="min-w-0 self-center">
              <h1
                className="break-words font-black uppercase leading-[1.05] tracking-[-0.025em] text-white"
                style={{ fontSize: "clamp(19px, 4.2vw, 22px)" }}
              >
                {fullName}
              </h1>

              <div
                className="rounded-full"
                style={{
                  width: 72,
                  maxWidth: "55%",
                  height: 3,
                  marginTop: 10,
                  backgroundColor: theme.accentColor,
                }}
                aria-hidden="true"
              />
            </div>

            <span className="justify-self-end">
              <ForwardIndicator onDark />
            </span>
          </div>

          <div
            className="grid grid-cols-3 items-center"
            style={{
              position: "absolute",
              top: "49%",
              left: "5%",
              right: "5%",
              height: "20%",
            }}
          >
            {[
              {
                value: position !== null ? `${position}.` : "—",
                label: "Vieta",
              },
              { value: points, label: "Punkti" },
              { value: `${wins}–${losses}`, label: "Bilance" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={
                  index > 0
                    ? { borderLeft: "1px solid rgba(255, 255, 255, 0.18)" }
                    : undefined
                }
              >
                <p
                  className="font-black leading-none tracking-[-0.045em]"
                  style={{
                    color: theme.accentColor,
                    fontSize: "clamp(24px, 5.4vw, 28px)",
                  }}
                >
                  {stat.label === "Bilance" ? (
                    <>{wins}<span style={{ display: "inline-block", margin: "0 3px", fontSize: ".55em", verticalAlign: ".12em" }}>–</span>{losses}</>
                  ) : stat.value}
                </p>

                <p
                  className="mt-1.5 font-bold uppercase tracking-[0.14em] text-white/90"
                  style={{ fontSize: 9 }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className="pt-3"
            style={{
              position: "absolute",
              left: "5%",
              right: "5%",
              bottom: "5%",
              borderTop: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className="shrink-0 font-medium"
                style={{
                  color: "rgba(255, 255, 255, 0.62)",
                  fontSize: "clamp(12px, 2.7vw, 13px)",
                }}
              >
                {played} no {totalMatches} spēlēm
              </p>

              <p
                className="shrink-0 font-bold text-white"
                style={{ fontSize: "clamp(12px, 2.7vw, 13px)" }}
              >
                {progress}%
              </p>
            </div>

            <div
              className="mt-2.5 overflow-hidden rounded-full bg-white/15"
              style={{ height: 8 }}
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: theme.accentColor,
                }}
              />
            </div>
          </div>
        </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 bg-white px-5 py-4"
          style={{ minHeight: 64 }}
        >
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">
              Pēdējo 5 spēļu forma
            </p>
          </div>

          <div
            className="flex items-center gap-2"
            aria-label={`Pēdējo piecu spēļu forma: ${currentForm
              .map((result) =>
                result === "win" ? "uzvara" : "zaudējums"
              )
              .join(", ") || "spēļu vēl nav"}`}
          >
            {Array.from({ length: 5 }, (_, index) => {
              const result = currentForm[index];

              return (
                <span
                  key={index}
                  className="block shrink-0 rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor:
                      result === "win"
                        ? "#8abf00"
                        : result === "loss"
                          ? "#ef4444"
                          : "#e5e7eb",
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>
      </Card>
    </Link>
  );
}
