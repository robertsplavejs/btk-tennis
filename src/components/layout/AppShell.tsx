import type { ReactNode } from "react";
import { connection } from "next/server";

import { createLayoutViewService } from "@/services/createLayoutViewService";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({
  children,
}: AppShellProps) {
  await connection();

  const { service, currentUser } =
    await createLayoutViewService();

  const layoutView = await service.getLayoutView(
    currentUser
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white">
      <AppHeader
        currentUserName={
          layoutView.currentUser?.fullName ?? null
        }
      />

      <main className="flex-1">{children}</main>

      <BottomNavigation
        key={`bottom-navigation-${layoutView.unreadNotifications}`}
        isAuthenticated={Boolean(layoutView.currentUser)}
        hasPlayerProfile={Boolean(
          layoutView.currentUser?.playerId
        )}
        isAdmin={layoutView.currentUser?.isAdmin ?? false}
        unreadNotifications={
          layoutView.unreadNotifications
        }
      />
    </div>
  );
}
