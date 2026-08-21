"use client";

import {
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import {
  saveMatchSchedule,
  type SaveMatchScheduleInput,
} from "@/app/matches/[matchId]/schedule/actions";
import type { TournamentMatch } from "@/types/match";

type MatchScheduleFormProps = {
  match: TournamentMatch;
};

function getInitialDate(scheduledAt?: string) {
  if (!scheduledAt) {
    return "";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialTime(scheduledAt?: string) {
  if (!scheduledAt) {
    return "";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function MatchScheduleForm({
  match,
}: MatchScheduleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [date, setDate] = useState(
    getInitialDate(match.scheduledAt)
  );

  const [time, setTime] = useState(
    getInitialTime(match.scheduledAt)
  );

  const [court, setCourt] = useState(match.court ?? "");
  const [location, setLocation] = useState(match.location ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] =
    useState<"error" | "success">("error");

  const submitLabel =
    match.status === "scheduled"
      ? "Saglabāt jauno laiku"
      : "Ieplānot spēli";

  const preview = useMemo(() => {
    if (!date || !time) {
      return null;
    }

    const scheduledDate = new Date(`${date}T${time}:00`);

    if (Number.isNaN(scheduledDate.getTime())) {
      return null;
    }

    return new Intl.DateTimeFormat("lv-LV", {
      timeZone: "Europe/Riga",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(scheduledDate);
  }, [date, time]);

  function clearMessage() {
    setMessage(null);
    setMessageType("error");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessage();

    if (!date) {
      setMessage("Izvēlies spēles datumu.");
      return;
    }

    if (!time) {
      setMessage("Izvēlies spēles laiku.");
      return;
    }

    if (!court.trim()) {
      setMessage("Norādi kortu.");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);

    if (Number.isNaN(scheduledAt.getTime())) {
      setMessage("Norādītais datums vai laiks nav derīgs.");
      return;
    }

    if (scheduledAt.getTime() <= Date.now()) {
      setMessage("Spēles laikam jābūt nākotnē.");
      return;
    }

    const input: SaveMatchScheduleInput = {
      scheduledAt: scheduledAt.toISOString(),
      court: court.trim(),
      location: location.trim() || undefined,
    };

    startTransition(async () => {
      const result = await saveMatchSchedule(match.id, input);

      if (!result.success) {
        setMessageType("error");
        setMessage(result.message);
        return;
      }

      setMessageType("success");
      setMessage(result.message);

      router.push(`/matches/${match.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Spēles laiks
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-black">
              Datums
            </span>

            <input
              type="date"
              value={date}
              disabled={isPending}
              onChange={(event) => {
                setDate(event.target.value);
                clearMessage();
              }}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-black">
              Laiks
            </span>

            <input
              type="time"
              value={time}
              disabled={isPending}
              onChange={(event) => {
                setTime(event.target.value);
                clearMessage();
              }}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Spēles vieta
        </p>

        <div className="mt-5 space-y-4">
          <label>
            <span className="text-sm font-medium text-black">
              Korts
            </span>

            <input
              type="text"
              value={court}
              disabled={isPending}
              onChange={(event) => {
                setCourt(event.target.value);
                clearMessage();
              }}
              placeholder="Piemēram, BTK 3. korts"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-black">
              Vieta
            </span>

            <input
              type="text"
              value={location}
              disabled={isPending}
              onChange={(event) => {
                setLocation(event.target.value);
                clearMessage();
              }}
              placeholder="Piemēram, Bīriņa tenisa klubs"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>
      </Card>

      {preview && (
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
            Priekšskatījums
          </p>

          <p className="mt-2 text-lg font-semibold text-black capitalize">
            {preview}
          </p>

          {court && (
            <p className="mt-2 text-sm text-neutral-500">
              {court}
            </p>
          )}

          {location && (
            <p className="mt-1 text-sm text-neutral-500">
              {location}
            </p>
          )}
        </Card>
      )}

      {message && (
        <p
          className={
            messageType === "success"
              ? "rounded-2xl bg-green-50 px-4 py-3 text-sm leading-5 text-green-700"
              : "rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          }
          role={messageType === "success" ? "status" : "alert"}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saglabā..." : submitLabel}
      </button>
    </form>
  );
}