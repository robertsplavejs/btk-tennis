"use client";

import {
  type SVGProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import {
  Bell,
  CircleUserRound,
  createLucideIcon,
  Home,
  Trophy,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavigationProps = {
  isAuthenticated?: boolean;
  hasPlayerProfile?: boolean;
  isAdmin?: boolean;
  unreadNotifications?: number;
};

type UnreadCountResponse = {
  unreadCount?: number;
};

function TennisRacketIcon({
  size = 24,
  width = size,
  height = size,
  fill = "none",
  ...props
}: SVGProps<SVGSVGElement> & { size?: string | number }) {
  const isFilled = fill === "currentColor";

  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="tennis-racket-strings">
          <ellipse cx="8" cy="7.5" rx="4.25" ry="5.5" />
        </clipPath>
      </defs>

      <g
        transform="rotate(-40 8 7.5)"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="8" cy="7.5" rx="4.25" ry="5.5" fill={isFilled ? "currentColor" : "none"} strokeWidth="1.45" />

        <g clipPath="url(#tennis-racket-strings)" stroke={isFilled ? "white" : "currentColor"} strokeWidth="0.4">
          <path d="M5.5 1.5v12" />
          <path d="M8 1.5v12" />
          <path d="M10.5 1.5v12" />
          <path d="M3 4.5h10" />
          <path d="M3 7.5h10" />
          <path d="M3 10.5h10" />
        </g>

        <path d="M8 13v7" strokeWidth="1.45" />
        <path d="M6.8 19.2h2.4v3H6.8z" strokeWidth="1.45" />
      </g>

      <circle cx="18.5" cy="5" r="1.15" fill="currentColor" />
    </svg>
  );
}

const ActiveProfile = createLucideIcon("ActiveProfile", [
  ["circle", { cx: "12", cy: "12", r: "10", fill: "currentColor", stroke: "none", key: "background" }],
  ["circle", { cx: "12", cy: "8.2", r: "3", fill: "white", stroke: "none", key: "head" }],
  ["path", { d: "M6.6 18.2c.7-3 2.5-4.5 5.4-4.5s4.7 1.5 5.4 4.5c-1.5 1.2-3.3 1.8-5.4 1.8s-3.9-.6-5.4-1.8Z", fill: "white", stroke: "none", key: "body" }],
]);

const ActiveTrophy = createLucideIcon("ActiveTrophy", [
  ["path", { d: "M6 2h12v5c0 4-2 6.6-5 7.5V17h3.5a1 1 0 0 1 1 1v2H6.5v-2a1 1 0 0 1 1-1H11v-2.5C8 13.6 6 11 6 7V2Z", fill: "currentColor", stroke: "none", key: "cup" }],
  ["path", { d: "M6 4H2v3c0 3.3 2 5.6 5.2 6.2l.5-2C5.4 10.7 4 9.2 4 7V6h2V4Zm12 0h4v3c0 3.3-2 5.6-5.2 6.2l-.5-2C18.6 10.7 20 9.2 20 7V6h-2V4Z", fill: "currentColor", stroke: "none", key: "handles" }],
]);

const navigationItems = [
  {
    label: "Sākums",
    icon: Home,
    activeIcon: Home,
    iconSize: 24,
    href: "/",
  },
  {
    label: "Spēles",
    icon: TennisRacketIcon,
    activeIcon: TennisRacketIcon,
    iconSize: 27,
    href: "/matches",
  },
  {
    label: "Turnīri",
    icon: Trophy,
    activeIcon: ActiveTrophy,
    iconSize: 24,
    href: "/tournament",
  },
  {
    label: "Paziņojumi",
    icon: Bell,
    activeIcon: Bell,
    iconSize: 24,
    href: "/notifications",
  },
  {
    label: "Profils",
    icon: CircleUserRound,
    activeIcon: ActiveProfile,
    iconSize: 24,
    href: "/profile",
  },
];

function formatUnreadCount(count: number) {
  return count > 9 ? "9+" : String(count);
}

export function BottomNavigation({
  isAuthenticated = false,
  hasPlayerProfile = false,
  isAdmin = false,
  unreadNotifications = 0,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const lastUnreadLoadAt = useRef(0);
  const unreadRequest = useRef<Promise<void> | null>(null);

  const [unreadCount, setUnreadCount] = useState(
    unreadNotifications
  );

  useEffect(() => {
    lastUnreadLoadAt.current = Date.now();
  }, []);

  const loadUnreadCount = useCallback(async (force = false) => {
    const now = Date.now();

    if (
      !isAuthenticated ||
      unreadRequest.current ||
      (!force && now - lastUnreadLoadAt.current < 60_000)
    ) {
      return;
    }

    unreadRequest.current = (async () => {
      try {
        const response = await fetch(
          "/api/notifications/unread-count",
          {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as UnreadCountResponse;

        setUnreadCount(
          typeof data.unreadCount === "number"
            ? data.unreadCount
            : 0
        );
        lastUnreadLoadAt.current = Date.now();
      } catch (error) {
        console.error(
          "Neizdevās atjaunot paziņojumu skaitu:",
          error
        );
      } finally {
        unreadRequest.current = null;
      }
    })();

    await unreadRequest.current;
  }, [isAuthenticated]);

  useEffect(() => {
    function handleWindowFocus() {
      void loadUnreadCount();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadUnreadCount();
      }
    }

    window.addEventListener("focus", handleWindowFocus);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadUnreadCount]);

  const visibleNavigationItems = !isAuthenticated
    ? [
        navigationItems[0],
        navigationItems[2],
        {
          label: "Ienākt",
          icon: LogIn,
          activeIcon: LogIn,
          iconSize: 24,
          href: "/login",
        },
      ]
    : hasPlayerProfile
      ? navigationItems
      : [
          navigationItems[2],
          ...(isAdmin
            ? [{
                label: "Administrācija",
                icon: ShieldCheck,
                activeIcon: ShieldCheck,
                iconSize: 24,
                href: "/admin",
              }]
            : []),
        ];

  return (
    <nav className="sticky bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur">
      <div
        className={clsx(
          "mx-auto grid h-20 w-full max-w-md px-2",
          visibleNavigationItems.length === 5
            ? "grid-cols-5"
            : visibleNavigationItems.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        )}
      >
        {visibleNavigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = isActive ? item.activeIcon : item.icon;

          const showUnreadBadge =
            item.href === "/notifications" &&
            unreadCount > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive
                  ? "font-semibold text-[#30363d]"
                  : "font-normal text-[#7b8087] hover:text-[#30363d]"
              )}
            >
              <span className="relative leading-none">
                <Icon aria-hidden="true" size={item.iconSize} strokeWidth={1.65} fill={isActive ? "currentColor" : "none"} />

                {showUnreadBadge && (
                  <span className="absolute -right-3 -top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {formatUnreadCount(unreadCount)}
                  </span>
                )}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
