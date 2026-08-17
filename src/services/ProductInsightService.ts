export type ProductInsight = {
  tone: "positive" | "attention" | "neutral";
  eyebrow: string;
  message: string;
  href: string;
};

type WinScenarioInput = {
  matchId: string;
  opponentName: string;
  projectedPosition: number;
};

type ProductInsightInput = {
  position: number | null;
  qualificationPlaces: number;
  remainingMatches: number;
  currentForm: Array<"win" | "loss">;
  winScenario?: WinScenarioInput | null;
};

export class ProductInsightService {
  getPrimaryInsight(
    input: ProductInsightInput
  ): ProductInsight | null {
    if (input.remainingMatches === 0) {
      return {
        tone: "neutral",
        eyebrow: "Turnīra progress",
        message: "Visas tavas turnīra spēles ir izspēlētas.",
        href: "/tournament",
      };
    }

    if (input.winScenario) {
      return {
        tone: "positive",
        eyebrow: "Tabulas scenārijs",
        message: `Pēc pašreizējās tabulas aprēķina uzvara pret ${input.winScenario.opponentName} paceltu tevi uz ${input.winScenario.projectedPosition}. vietu.`,
        href: `/matches/${input.winScenario.matchId}`,
      };
    }

    if (input.remainingMatches <= 2) {
      return {
        tone: "attention",
        eyebrow: "Turnīra finišs",
        message:
          input.remainingMatches === 1
            ? "Tev atlikusi vēl tikai viena spēle."
            : "Tev atlikušas vēl tikai divas spēles.",
        href: "/matches?filter=unscheduled",
      };
    }

    if (
      input.position !== null &&
      input.qualificationPlaces > 0 &&
      input.position <= input.qualificationPlaces
    ) {
      return {
        tone: "positive",
        eyebrow: "Kvalifikācijas zona",
        message: `Tu šobrīd esi kvalifikācijas zonā — ${input.position}. vietā.`,
        href: "/tournament",
      };
    }

    if (
      input.position !== null &&
      input.qualificationPlaces > 0 &&
      input.position === input.qualificationPlaces + 1
    ) {
      return {
        tone: "attention",
        eyebrow: "Kvalifikācijas zona",
        message: "Tu esi vienu vietu aiz kvalifikācijas zonas.",
        href: "/tournament",
      };
    }

    if (
      input.currentForm.length >= 3 &&
      input.currentForm.slice(0, 3).every((result) => result === "win")
    ) {
      return {
        tone: "positive",
        eyebrow: "Aktuālā forma",
        message: "Tev ir trīs uzvaras pēc kārtas.",
        href: "/profile",
      };
    }

    return null;
  }
}
