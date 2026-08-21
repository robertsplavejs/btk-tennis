import type { MatchCardTheme } from "./MatchCardTheme";

type MatchCardFooterProps = {
  playedAt?: string | null;
  location?: string | null;
  court?: string | null;
  theme: MatchCardTheme;
};

function formatPlayedAt(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function MatchCardFooter({
  playedAt,
  location,
  court,
  theme,
}: MatchCardFooterProps) {
  const formattedDate = formatPlayedAt(playedAt);

  const place = [location, court]
    .filter(Boolean)
    .join(" · ");

  if (!formattedDate && !place) {
    return null;
  }

  return (
    <div
      className="border-t px-6 py-5 text-center"
      style={{
        borderColor: theme.border,
      }}
    >
      {formattedDate && (
        <p
          className="text-sm font-semibold first-letter:uppercase"
          style={{
            color: theme.primaryText,
          }}
        >
          {formattedDate}
        </p>
      )}

      {place && (
        <p
          className="mt-1 text-xs"
          style={{
            color: theme.secondaryText,
          }}
        >
          {place}
        </p>
      )}
    </div>
  );
}