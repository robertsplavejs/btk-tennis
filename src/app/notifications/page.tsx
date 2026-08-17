import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/app/notifications/actions";
import { Card } from "@/components/ui/Card";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createNotificationService } from "@/services/createNotificationService";
import type { NotificationViewItem } from "@/services/NotificationService";

type NotificationsPageProps = {
  searchParams: Promise<{
    filter?: string | string[];
  }>;
};

function formatNotificationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Laiks nav pieejams";
  }

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return new Intl.DateTimeFormat("lv-LV", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("lv-LV", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function NotificationIcon({ type }: { type: string }) {
  if (type === "walkover" || type === "retired") {
    return (
      <span className="text-[9px] font-black tracking-tight">
        {type === "walkover" ? "WO" : "RET"}
      </span>
    );
  }

  const paths =
    type === "match_scheduled" || type === "match_rescheduled" ? (
      <>
        <rect x="3" y="4.5" width="14" height="12" rx="2" />
        <path d="M6 2.5v4M14 2.5v4M3 8.5h14" />
      </>
    ) : type === "tournament_created" || type === "tournament_started" ? (
      <>
        <path d="M6 3h8v3.5a4 4 0 0 1-8 0V3Z" />
        <path d="M6 5H3v1a3 3 0 0 0 3 3M14 5h3v1a3 3 0 0 1-3 3M10 10.5V14M7 17h6M8 14h4" />
      </>
    ) : (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="M5.2 5.2c3.2 2.4 6.4 7.2 9.6 9.6M14.8 5.2c-3.2 2.4-6.4 7.2-9.6 9.6" />
      </>
    );

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

function NotificationItem({
  notification,
}: {
  notification: NotificationViewItem;
}) {
  return (
    <form
      action={markNotificationAsRead.bind(
        null,
        notification.id
      )}
    >
      <button
        type="submit"
        className="flex w-full items-start gap-3.5 px-4 py-4 text-left transition-transform active:scale-[0.99]"
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          gap: 14,
          padding: 16,
          textAlign: "left",
        }}
      >
        <span
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]",
            notification.isRead
              ? "bg-neutral-100 text-neutral-400"
              : "bg-[#eff8d9] text-[#5f9200]"
          )}
          style={{
            display: "flex",
            width: 40,
            height: 40,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 13,
            color: notification.isRead ? "#a0a6ad" : "#5f9200",
            background: notification.isRead ? "#f3f4f6" : "#eff8d9",
          }}
          aria-hidden="true"
        >
          <NotificationIcon type={notification.type} />
        </span>

        <span className="min-w-0 flex-1" style={{ minWidth: 0, flex: 1 }}>
          <span className="flex items-start gap-2" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span
              className={clsx(
                "min-w-0 flex-1 text-sm leading-5 text-[#111827]",
                notification.isRead
                  ? "font-semibold"
                  : "font-bold"
              )}
              style={{ minWidth: 0, flex: 1, color: "#111827", fontSize: 14, fontWeight: notification.isRead ? 700 : 900, lineHeight: "20px" }}
            >
              {notification.title}
            </span>

            {!notification.isRead && (
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#9be000] ring-2 ring-[#eff8d9]"
                style={{ width: 8, height: 8, flexShrink: 0, marginTop: 6, borderRadius: "50%", background: "#9be000", boxShadow: "0 0 0 2px #eff8d9" }}
                aria-label="Nelasīts paziņojums"
              />
            )}
          </span>

          <span className="mt-1 block text-[13px] leading-[19px] text-[#737b86]" style={{ display: "block", marginTop: 4, color: "#737b86", fontSize: 13, lineHeight: "19px" }}>
            {notification.body}
          </span>

          <span className="mt-2.5 flex items-center justify-between gap-3 text-[10px] font-medium text-[#a0a6ad]" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 10, color: "#a0a6ad", fontSize: 10, fontWeight: 500 }}>
            <span className="truncate">
              {notification.actor?.fullName ?? "BTK Tennis"}
            </span>
            <span className="shrink-0">
              {formatNotificationDate(notification.createdAt)}
            </span>
          </span>
        </span>
      </button>
    </form>
  );
}

function NotificationGroup({
  title,
  notifications,
}: {
  title: string;
  notifications: NotificationViewItem[];
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: 0 }}>
      <h2 className="mb-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#9ca3af]" style={{ margin: "0 0 12px", color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>
        {title}
      </h2>
      <div className="grid gap-2.5" style={{ display: "grid", gap: 10 }}>
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="overflow-hidden rounded-[20px] border-[#edf0f2] shadow-[0_5px_18px_rgba(15,23,42,0.045)]"
            style={{
              overflow: "hidden",
              border: "1px solid #edf0f2",
              borderRadius: 20,
              background: "#fff",
              boxShadow: "0 5px 18px rgba(15,23,42,.045)",
            }}
          >
            <NotificationItem notification={notification} />
          </Card>
        ))}
      </div>
    </section>
  );
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.playerId) {
    redirect(identity.isAdmin ? "/admin" : "/");
  }

  const notificationService = await createNotificationService();
  const notifications = await notificationService.getNotifications(
    identity.playerId
  );
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );
  const previousNotifications = notifications.filter(
    (notification) => notification.isRead
  );
  const query = await searchParams;
  const requestedFilter = Array.isArray(query.filter)
    ? query.filter[0]
    : query.filter;
  const activeFilter = requestedFilter === "unread" ? "unread" : "all";
  const hasVisibleNotifications =
    activeFilter === "unread"
      ? unreadNotifications.length > 0
      : notifications.length > 0;

  return (
    <main className="min-h-full w-full space-y-6 overflow-x-hidden px-4 pb-28 pt-4 text-[#0f172a]" style={{ display: "grid", alignContent: "start", gap: 24, width: "100%", minHeight: "100%", padding: "16px 16px 112px", overflowX: "hidden", color: "#0f172a" }}>
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-[#edf0f2]" style={{ display: "flex", minHeight: 40, alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #edf0f2" }}>
        <nav
          aria-label="Paziņojumu filtrs"
          className="flex self-stretch gap-5"
          style={{ display: "flex", alignSelf: "stretch", gap: 20 }}
        >
          <Link
            href="/notifications"
            className={clsx(
              "relative flex items-center px-0.5 text-[12px] font-bold transition-colors",
              activeFilter === "all"
                ? "text-[#111827] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-[#9be000]"
                : "text-[#9aa0a8] hover:text-[#111827]"
            )}
            style={{ position: "relative", display: "flex", alignItems: "center", padding: "0 2px", color: activeFilter === "all" ? "#111827" : "#9aa0a8", fontSize: 12, fontWeight: 800, textDecoration: activeFilter === "all" ? "underline 2px #9be000" : "none", textUnderlineOffset: 12 }}
          >
            Visi
          </Link>
          <Link
            href="/notifications?filter=unread"
            className={clsx(
              "relative flex items-center px-0.5 text-[12px] font-bold transition-colors",
              activeFilter === "unread"
                ? "text-[#111827] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-[#9be000]"
                : "text-[#9aa0a8] hover:text-[#111827]"
            )}
            style={{ position: "relative", display: "flex", alignItems: "center", padding: "0 2px", color: activeFilter === "unread" ? "#111827" : "#9aa0a8", fontSize: 12, fontWeight: 800, textDecoration: activeFilter === "unread" ? "underline 2px #9be000" : "none", textUnderlineOffset: 12 }}
          >
            Nelasītie
            {unreadNotifications.length > 0 && (
              <span className="ml-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#eff8d9] px-1 text-[9px] font-black text-[#5f9200]" style={{ display: "grid", minWidth: 16, height: 16, marginLeft: 6, padding: "0 4px", placeItems: "center", borderRadius: 99, color: "#5f9200", background: "#eff8d9", fontSize: 9, fontWeight: 900 }}>
                {unreadNotifications.length}
              </span>
            )}
          </Link>
        </nav>

        {unreadNotifications.length > 0 && (
          <form action={markAllNotificationsAsRead}>
            <button
              type="submit"
              className="max-w-[132px] py-2 text-right text-[10px] font-extrabold leading-4 text-[#67707b] transition-colors hover:text-[#111827]"
              style={{ maxWidth: 132, padding: "8px 0", color: "#67707b", fontSize: 10, fontWeight: 800, lineHeight: "16px", textAlign: "right" }}
            >
              Atzīmēt visu kā izlasītu
            </button>
          </form>
        )}
      </div>

      {!hasVisibleNotifications ? (
        <Card className="rounded-[22px] border-[#edf0f2] p-5 shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#eff8d9] text-[#5f9200]">
            <NotificationIcon type="system" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-black">
            {activeFilter === "unread"
              ? "Viss ir izlasīts"
              : "Paziņojumu vēl nav"}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-neutral-500">
            {activeFilter === "unread"
              ? "Tev pašlaik nav neviena nelasīta paziņojuma."
              : "Šeit parādīsies informācija par spēļu laikiem, rezultātiem un turnīra aktualitātēm."}
          </p>
        </Card>
      ) : (
        <div className="space-y-6" style={{ display: "grid", gap: 24 }}>
          <NotificationGroup
            title="Nelasītie"
            notifications={unreadNotifications}
          />
          {activeFilter === "all" && (
            <NotificationGroup
              title="Iepriekšējie"
              notifications={previousNotifications}
            />
          )}
        </div>
      )}
    </main>
  );
}
