import { NextResponse } from "next/server";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createNotificationService } from "@/services/createNotificationService";

export async function GET() {
  try {
    const identity = await getCurrentIdentity();

    if (!identity?.playerId) {
      return NextResponse.json({
        unreadCount: 0,
      });
    }

    const notificationService =
      await createNotificationService();

    const unreadCount =
      await notificationService.getUnreadCount(identity.playerId);

    return NextResponse.json(
      {
        unreadCount,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Neizdevās ielādēt nelasīto paziņojumu skaitu:",
      error
    );

    return NextResponse.json(
      {
        unreadCount: 0,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
