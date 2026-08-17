import { GroupRepository } from "@/repositories/GroupRepository";
import { TournamentRepository } from "@/repositories/TournamentRepository";
import type { Database } from "@/types/database";

type TournamentInsert =
  Database["public"]["Tables"]["tournaments"]["Insert"];

type TournamentUpdate =
  Database["public"]["Tables"]["tournaments"]["Update"];

type TournamentStatus =
  Database["public"]["Tables"]["tournaments"]["Row"]["status"];

type CreateTournamentInput = {
  seasonId: string;
  name: string;
  slug: string;
  status?: TournamentStatus;
  qualificationPlaces?: number | null;
  pointsForWin?: number;
  pointsForLoss?: number;
};

type UpdateTournamentInput = {
  name?: string;
  slug?: string;
  status?: TournamentStatus;
  qualificationPlaces?: number | null;
  pointsForWin?: number;
  pointsForLoss?: number;
};

const allowedStatuses: TournamentStatus[] = [
  "draft",
  "active",
  "completed",
  "archived",
];

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[āáàäâ]/g, "a")
    .replace(/[č]/g, "c")
    .replace(/[ēéèëê]/g, "e")
    .replace(/[ģ]/g, "g")
    .replace(/[īíìïî]/g, "i")
    .replace(/[ķ]/g, "k")
    .replace(/[ļ]/g, "l")
    .replace(/[ņ]/g, "n")
    .replace(/[š]/g, "s")
    .replace(/[ūúùüû]/g, "u")
    .replace(/[ž]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validatePoints(
  pointsForWin?: number,
  pointsForLoss?: number
) {
  if (
    pointsForWin !== undefined &&
    (!Number.isInteger(pointsForWin) || pointsForWin < 0)
  ) {
    throw new Error(
      "Punktiem par uzvaru jābūt veselam skaitlim, kas nav mazāks par 0."
    );
  }

  if (
    pointsForLoss !== undefined &&
    (!Number.isInteger(pointsForLoss) || pointsForLoss < 0)
  ) {
    throw new Error(
      "Punktiem par zaudējumu jābūt veselam skaitlim, kas nav mazāks par 0."
    );
  }

  if (
    pointsForWin !== undefined &&
    pointsForLoss !== undefined &&
    pointsForWin <= pointsForLoss
  ) {
    throw new Error(
      "Punktiem par uzvaru jābūt lielākiem nekā punktiem par zaudējumu."
    );
  }
}

function validateQualificationPlaces(
  qualificationPlaces?: number | null
) {
  if (
    qualificationPlaces !== undefined &&
    qualificationPlaces !== null &&
    (!Number.isInteger(qualificationPlaces) ||
      qualificationPlaces < 1)
  ) {
    throw new Error(
      "Kvalifikācijas vietu skaitam jābūt pozitīvam veselam skaitlim."
    );
  }
}

export class TournamentService {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly groupRepository: GroupRepository
  ) {}

  async getTournaments() {
    return this.tournamentRepository.getAll();
  }

  async getTournamentById(id: string) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    return this.tournamentRepository.getById(normalizedId);
  }

  async createTournament(input: CreateTournamentInput) {
    const seasonId = input.seasonId.trim();
    const name = normalizeName(input.name);
    const slug = normalizeSlug(input.slug || input.name);
    const status = input.status ?? "draft";

    if (!seasonId) {
      throw new Error("Sezona nav norādīta.");
    }

    if (name.length < 2) {
      throw new Error(
        "Turnīra nosaukumam jābūt vismaz 2 rakstzīmes garam."
      );
    }

    if (!slug) {
      throw new Error(
        "Turnīra identifikatoru neizdevās izveidot."
      );
    }

    if (!allowedStatuses.includes(status)) {
      throw new Error("Norādīts neatļauts turnīra statuss.");
    }

    validateQualificationPlaces(input.qualificationPlaces);
    validatePoints(input.pointsForWin, input.pointsForLoss);

    const tournamentData: TournamentInsert = {
      season_id: seasonId,
      name,
      slug,
      status,
      qualification_places:
        input.qualificationPlaces ?? null,
      points_for_win: input.pointsForWin ?? 3,
      points_for_loss: input.pointsForLoss ?? 1,
    };

    const tournament =
      await this.tournamentRepository.create(tournamentData);

    await this.groupRepository.create({
      tournament_id: tournament.id,
      name,
      slug: "main",
    });

    return tournament;
  }

  async updateTournament(
    id: string,
    input: UpdateTournamentInput
  ) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    const name =
      input.name === undefined
        ? undefined
        : normalizeName(input.name);

    const slug =
      input.slug === undefined
        ? undefined
        : normalizeSlug(input.slug);

    if (name !== undefined && name.length < 2) {
      throw new Error(
        "Turnīra nosaukumam jābūt vismaz 2 rakstzīmes garam."
      );
    }

    if (slug !== undefined && !slug) {
      throw new Error(
        "Turnīra identifikators nevar būt tukšs."
      );
    }

    if (
      input.status !== undefined &&
      !allowedStatuses.includes(input.status)
    ) {
      throw new Error("Norādīts neatļauts turnīra statuss.");
    }

    validateQualificationPlaces(input.qualificationPlaces);
    validatePoints(input.pointsForWin, input.pointsForLoss);

    const tournament: TournamentUpdate = {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(input.status !== undefined && {
        status: input.status,
      }),
      ...(input.qualificationPlaces !== undefined && {
        qualification_places: input.qualificationPlaces,
      }),
      ...(input.pointsForWin !== undefined && {
        points_for_win: input.pointsForWin,
      }),
      ...(input.pointsForLoss !== undefined && {
        points_for_loss: input.pointsForLoss,
      }),
      updated_at: new Date().toISOString(),
    };

    return this.tournamentRepository.update(
      normalizedId,
      tournament
    );
  }
}