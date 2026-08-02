import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <BottomNavigation />
    </div>
  );
}