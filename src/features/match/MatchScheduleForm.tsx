"use client";

import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/Card";
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
  const [date, setDate] = useState(
    getInitialDate(match.scheduledAt)
  );

  const [time, setTime] = useState(
    getInitialTime(match.scheduledAt)
  );

  const [court, setCourt] = useState(match.court ?? "");
  const [location, setLocation] = useState(match.location ?? "");
  const [message, setMessage] = useState<string | null>(null);

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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(scheduledDate);
  }, [date, time]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    console.log({
      matchId: match.id,
      scheduledAt: scheduledAt.toISOString(),
      court: court.trim(),
      location: location.trim() || undefined,
    });

    setMessage(
      match.status === "scheduled"
        ? "Jaunais spēles laiks ir sagatavots saglabāšanai."
        : "Spēles laiks ir sagatavots saglabāšanai."
    );
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
              onChange={(event) => {
                setDate(event.target.value);
                setMessage(null);
              }}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-black">
              Laiks
            </span>

            <input
              type="time"
              value={time}
              onChange={(event) => {
                setTime(event.target.value);
                setMessage(null);
              }}
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
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
              onChange={(event) => {
                setCourt(event.target.value);
                setMessage(null);
              }}
              placeholder="Piemēram, BTK 3. korts"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-black">
              Vieta
            </span>

            <input
              type="text"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setMessage(null);
              }}
              placeholder="Piemēram, Bīriņa tenisa klubs"
              className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black"
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
          className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-5 text-neutral-700"
          role="status"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
      >
        {submitLabel}
      </button>
    </form>
  );
}