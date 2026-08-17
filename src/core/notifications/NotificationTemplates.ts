type MatchScheduleTemplateInput = {
  actorName: string;
  scheduledAt?: string | null;
  location?: string | null;
  court?: string | null;
};

type MatchResultTemplateInput = {
  actorName: string;
  score?: string | null;
};

type WalkoverTemplateInput = {
  winnerName?: string | null;
};

type RetiredTemplateInput = {
  winnerName?: string | null;
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

export const NotificationTemplates = {
  matchScheduled(input: MatchScheduleTemplateInput) {
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
      body: details
        ? `${input.actorName} ieplānoja jūsu spēli. ${details}`
        : `${input.actorName} ieplānoja jūsu spēli.`,
    };
  },

  matchRescheduled(input: MatchScheduleTemplateInput) {
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
      body: details
        ? `${input.actorName} mainīja jūsu spēles laiku. ${details}`
        : `${input.actorName} mainīja jūsu spēles informāciju.`,
    };
  },

  resultCreated(input: MatchResultTemplateInput) {
    return {
      title: "Rezultāts ievadīts",
      body: input.score
        ? `${input.actorName} ievadīja jūsu spēles rezultātu: ${input.score}.`
        : `${input.actorName} ievadīja jūsu spēles rezultātu.`,
    };
  },

  resultUpdated(input: MatchResultTemplateInput) {
    return {
      title: "Rezultāts izlabots",
      body: input.score
        ? `${input.actorName} izlaboja jūsu spēles rezultātu: ${input.score}.`
        : `${input.actorName} izlaboja jūsu spēles rezultātu.`,
    };
  },

  walkover(input: WalkoverTemplateInput) {
    return {
      title: "Piešķirta tehniskā uzvara",
      body: input.winnerName
        ? `Spēlē piešķirta tehniskā uzvara spēlētājam ${input.winnerName}.`
        : "Spēlē piešķirta tehniskā uzvara.",
    };
  },

  retired(input: RetiredTemplateInput) {
    const scoreText = input.score
      ? ` Rezultāts: ${input.score}.`
      : "";

    return {
      title: "Spēle pabeigta ar izstāšanos",
      body: input.winnerName
        ? `Par spēles uzvarētāju atzīts ${input.winnerName}.${scoreText}`
        : `Spēle pabeigta ar viena spēlētāja izstāšanos.${scoreText}`,
    };
  },

  tournamentStarted(tournamentName: string) {
    return {
      title: "Turnīrs sācies",
      body: `Turnīrs “${tournamentName}” ir sācies. Apskati savas spēles un turnīra tabulu.`,
    };
  },

  system(title: string, body: string) {
    return {
      title,
      body,
    };
  },
};