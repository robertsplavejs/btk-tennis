import { PlayerRepository } from "@/repositories/PlayerRepository";

export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository
  ) {}

  async getPlayers() {
    return this.playerRepository.getAll();
  }

  async getPlayerById(id: string) {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new Error("Spēlētāja ID nav norādīts.");
    }

    return this.playerRepository.getById(normalizedId);
  }
}