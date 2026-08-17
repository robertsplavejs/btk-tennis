import Image from "next/image";
import Link from "next/link";

import { logout } from "@/app/logout/actions";

type AppHeaderProps = {
  currentUserName?: string | null;
};

export function AppHeader({
  currentUserName,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div
        className="mx-auto h-16 w-full max-w-md px-4"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <span aria-hidden="true" />

        <Link
          href="/"
          className="flex items-center justify-center"
          style={{ gridColumn: 2 }}
          aria-label="BTK sākumlapa"
        >
          <Image
            src="/branding/btk-logo.png"
            alt="BTK"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </Link>

        {currentUserName && (
          <form
            action={logout}
            className="justify-self-end"
            style={{
              gridColumn: 3,
              justifySelf: "end",
            }}
          >
            <button
              type="submit"
              className="rounded-xl px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black"
              aria-label={`Iziet no ${currentUserName} profila`}
            >
              Iziet
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
