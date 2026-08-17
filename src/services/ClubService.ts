import { ClubRepository } from "@/repositories/ClubRepository";

export class ClubService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async getClubs() {
    return this.clubRepository.getAll();
  }

  async getClubBySlug(slug: string) {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      throw new Error("Kluba identifikators nav norādīts.");
    }

    return this.clubRepository.getBySlug(normalizedSlug);
  }

  async requireClubBySlug(slug: string) {
    const club = await this.getClubBySlug(slug);

    if (!club) {
      throw new Error(`Klubs ar identifikatoru "${slug}" nav atrasts.`);
    }

    return club;
  }
}