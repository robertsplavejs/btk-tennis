import type { Database } from "@/types/database";
import { SeasonRepository } from "@/repositories/SeasonRepository";

type SeasonInsert =
  Database["public"]["Tables"]["seasons"]["Insert"];

type SeasonUpdate =
  Database["public"]["Tables"]["seasons"]["Update"];

type CreateSeasonInput = {
  clubId: string;
  name: string;
  startsOn?: string;
  endsOn?: string;
  isActive?: boolean;
};

type UpdateSeasonInput = {
  name?: string;
  startsOn?: string | null;
  endsOn?: string | null;
  isActive?: boolean;
};

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function validateDateRange(
  startsOn?: string | null,
  endsOn?: string | null
) {
  if (!startsOn || !endsOn) {
    return;
  }

  const startDate = new Date(startsOn);
  const endDate = new Date(endsOn);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    throw new Error("Norādīts nederīgs sezonas datums.");
  }

  if (endDate < startDate) {
    throw new Error(
      "Sezonas beigu datums nevar būt pirms sākuma datuma."
    );
  }
}

export class SeasonService {
  constructor(
    private readonly seasonRepository: SeasonRepository
  ) {}

  async getSeasons() {
    return this.seasonRepository.getAll();
  }

  async getSeasonById(id: string) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new Error("Sezonas ID nav norādīts.");
    }

    return this.seasonRepository.getById(normalizedId);
  }

  async createSeason(input: CreateSeasonInput) {
    const name = normalizeName(input.name);

    if (!input.clubId.trim()) {
      throw new Error("Klubs nav norādīts.");
    }

    if (name.length < 2) {
      throw new Error(
        "Sezonas nosaukumam jābūt vismaz 2 rakstzīmes garam."
      );
    }

    validateDateRange(input.startsOn, input.endsOn);

    const season: SeasonInsert = {
      club_id: input.clubId,
      name,
      starts_on: input.startsOn || null,
      ends_on: input.endsOn || null,
      is_active: input.isActive ?? false,
    };

    return this.seasonRepository.create(season);
  }

  async updateSeason(
    id: string,
    input: UpdateSeasonInput
  ) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new Error("Sezonas ID nav norādīts.");
    }

    const name =
      input.name === undefined
        ? undefined
        : normalizeName(input.name);

    if (name !== undefined && name.length < 2) {
      throw new Error(
        "Sezonas nosaukumam jābūt vismaz 2 rakstzīmes garam."
      );
    }

    validateDateRange(input.startsOn, input.endsOn);

    const season: SeasonUpdate = {
      ...(name !== undefined && { name }),
      ...(input.startsOn !== undefined && {
        starts_on: input.startsOn,
      }),
      ...(input.endsOn !== undefined && {
        ends_on: input.endsOn,
      }),
      ...(input.isActive !== undefined && {
        is_active: input.isActive,
      }),
      updated_at: new Date().toISOString(),
    };

    return this.seasonRepository.update(
      normalizedId,
      season
    );
  }
}