"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navigationItems = [
  { label: "Sākums", icon: "⌂", href: "/" },
  { label: "Spēles", icon: "◉", href: "/matches" },
  { label: "Turnīri", icon: "♛", href: "/tournament" },
  { label: "Paziņojumi", icon: "♢", href: "/notifications" },
  { label: "Profils", icon: "○", href: "/profile" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-20 w-full max-w-md grid-cols-5 px-2">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive
                  ? "font-semibold text-black"
                  : "text-black/50 hover:text-black"
              )}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}