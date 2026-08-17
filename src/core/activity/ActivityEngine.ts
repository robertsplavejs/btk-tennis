import { ActivityFactory } from "@/core/activity/ActivityFactory";
import type {
  MatchActivityContext,
  SystemActivityContext,
  TournamentActivityContext,
} from "@/core/activity/types";
import { ActivityRepository } from "@/repositories/ActivityRepository";

export class ActivityEngine {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly activityFactory: ActivityFactory
  ) {}

  async matchResult(context: MatchActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createMatchResult(context)
    );
  }

  async matchUpdated(context: MatchActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createMatchUpdated(context)
    );
  }

  async matchScheduled(context: MatchActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createMatchScheduled(context)
    );
  }

  async matchRescheduled(
    context: MatchActivityContext
  ) {
    return this.activityRepository.create(
      this.activityFactory.createMatchRescheduled(
        context
      )
    );
  }

  async walkover(context: MatchActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createWalkover(context)
    );
  }

  async retired(context: MatchActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createRetired(context)
    );
  }

  async tournamentStarted(
    context: TournamentActivityContext
  ) {
    return this.activityRepository.create(
      this.activityFactory.createTournamentStarted(
        context
      )
    );
  }

  async tournamentFinished(
    context: TournamentActivityContext
  ) {
    return this.activityRepository.create(
      this.activityFactory.createTournamentFinished(
        context
      )
    );
  }

  async system(context: SystemActivityContext) {
    return this.activityRepository.create(
      this.activityFactory.createSystem(context)
    );
  }
}