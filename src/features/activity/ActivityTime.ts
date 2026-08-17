const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

function isYesterday(date: Date, now: Date) {
  const yesterday = new Date(now);

  yesterday.setDate(now.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function formatActivityTime(
  value: string,
  now = new Date()
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Laiks nav pieejams";
  }

  const difference = Math.max(
    now.getTime() - date.getTime(),
    0
  );

  if (difference < MINUTE_IN_MS) {
    return "tikko";
  }

  if (difference < HOUR_IN_MS) {
    const minutes = Math.floor(
      difference / MINUTE_IN_MS
    );

    return `pirms ${minutes} min`;
  }

  if (difference < DAY_IN_MS) {
    const hours = Math.floor(
      difference / HOUR_IN_MS
    );

    return `pirms ${hours} h`;
  }

  if (isYesterday(date, now)) {
    return "vakar";
  }

  if (difference < 7 * DAY_IN_MS) {
    return new Intl.DateTimeFormat("lv-LV", {
      weekday: "long",
    }).format(date);
  }

  return new Intl.DateTimeFormat("lv-LV", {
    day: "numeric",
    month: "long",
  }).format(date);
}