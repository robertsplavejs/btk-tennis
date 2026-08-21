type MatchResultTemplateInput = {
  winnerName?: string | null;
  loserName?: string | null;
  score?: string | null;
};

type MatchScheduleTemplateInput = {
  actorName: string;
  playerOneName: string;
  playerTwoName: string;
  scheduledAt?: string | null;
  location?: string | null;
  court?: string | null;
};

type WalkoverTemplateInput = {
  winnerName?: string | null;
  loserName?: string | null;
};

type RetiredTemplateInput = {
  winnerName?: string | null;
  loserName?: string | null;
  score?: string | null;
};

function formatScheduledAt(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function createPlace(
  location?: string | null,
  court?: string | null
) {
  return [location, court].filter(Boolean).join(" · ");
}

function createMatchNames(
  playerOneName: string,
  playerTwoName: string
) {
  return `${playerOneName} pret ${playerTwoName}`;
}

export const ActivityTemplates = {
  matchResult(input: MatchResultTemplateInput) {
    const players =
      input.winnerName && input.loserName
        ? `${input.winnerName} uzvarēja ${input.loserName}`
        : "Spēle ir pabeigta";

    return {
      title: "Spēles rezultāts",
      description: input.score
        ? `${players} · ${input.score}`
        : players,
    };
  },

  matchUpdated(input: MatchResultTemplateInput) {
    const players =
      input.winnerName && input.loserName
        ? `${input.winnerName} uzvarēja ${input.loserName}`
        : "Spēles rezultāts ir atjaunināts";

    return {
      title: "Rezultāts izlabots",
      description: input.score
        ? `${players} · ${input.score}`
        : players,
    };
  },

  matchScheduled(input: MatchScheduleTemplateInput) {
    const matchNames = createMatchNames(
      input.playerOneName,
      input.playerTwoName
    );

    const scheduledAt = formatScheduledAt(
      input.scheduledAt
    );

    const place = createPlace(
      input.location,
      input.court
    );

    const details = [scheduledAt, place]
      .filter(Boolean)
      .join(" · ");

    return {
      title: "Spēle ieplānota",
      description: details
        ? `${matchNames} · ${details}`
        : `${input.actorName} ieplānoja spēli: ${matchNames}`,
    };
  },

  matchRescheduled(input: MatchScheduleTemplateInput) {
    const matchNames = createMatchNames(
      input.playerOneName,
      input.playerTwoName
    );

    const scheduledAt = formatScheduledAt(
      input.scheduledAt
    );

    const place = createPlace(
      input.location,
      input.court
    );

    const details = [scheduledAt, place]
      .filter(Boolean)
      .join(" · ");

    return {
      title: "Spēles laiks mainīts",
      description: details
        ? `${matchNames} · ${details}`
        : `${input.actorName} mainīja spēles informāciju: ${matchNames}`,
    };
  },

  walkover(input: WalkoverTemplateInput) {
    return {
      title: "Tehniskā uzvara",
      description:
        input.winnerName && input.loserName
          ? `${input.winnerName} piešķirta tehniskā uzvara spēlē pret ${input.loserName}`
          : input.winnerName
            ? `${input.winnerName} piešķirta tehniskā uzvara`
            : "Spēlē piešķirta tehniskā uzvara",
    };
  },

  retired(input: RetiredTemplateInput) {
    const players =
      input.winnerName && input.loserName
        ? `${input.winnerName} uzvarēja spēlē pret ${input.loserName}`
        : "Spēle pabeigta ar izstāšanos";

    return {
      title: "Spēle pabeigta ar izstāšanos",
      description: input.score
        ? `${players} · ${input.score}`
        : players,
    };
  },

  tournamentStarted(tournamentName: string) {
    return {
      title: "Turnīrs sācies",
      description: `Sācies turnīrs “${tournamentName}”.`,
    };
  },

  tournamentFinished(tournamentName: string) {
    return {
      title: "Turnīrs noslēdzies",
      description: `Noslēdzies turnīrs “${tournamentName}”.`,
    };
  },

  system(title: string, description: string) {
    return {
      title,
      description,
    };
  },
};