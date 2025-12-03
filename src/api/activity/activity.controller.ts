import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { ActivityService } from "./activity.service";

import {
  CreateHabitRequest,
  ToggleCompletionDto,
  HabitResponse,
  CompleteDayDto,
  CompleteDayResponse,
  ToggleCompletionResponse,
  DeleteHabitResponse,
} from "./dto";
import { Authorized, Protected } from "src/common/decorators";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({ summary: "Get all habits for a user" })
  @ApiOkResponse({ type: [HabitResponse] })
  @Protected()
  @Get("habits")
  getUserHabits(@Authorized("id") userId: string) {
    return this.activityService.getUserHabits(userId);
  }

  @ApiOperation({ summary: "Create a new habit" })
  @ApiOkResponse({ type: HabitResponse })
  @Protected()
  @ApiBody({ type: CreateHabitRequest })
  @Post("habits")
  createHabit(
    @Authorized("id") userId: string,
    @Body() dto: CreateHabitRequest,
  ) {
    return this.activityService.createHabit(userId, dto);
  }

  @ApiOperation({ summary: "Toggle a habit completion" })
  @ApiOkResponse({ type: ToggleCompletionResponse })
  @Protected()
  @ApiBody({ type: ToggleCompletionDto })
  @Post("habits/toggle")
  toggleCompletion(
    @Authorized("id") userId: string,
    @Body() dto: ToggleCompletionDto,
  ) {
    return this.activityService.toggleCompletion(userId, dto);
  }

  @ApiOperation({ summary: "Delete a habit" })
  @ApiOkResponse({ type: DeleteHabitResponse })
  @Protected()
  @Delete("habits/:habitId")
  deleteHabit(
    @Authorized("id") userId: string,
    @Param("habitId") habitId: string,
  ) {
    return this.activityService.deleteHabit(userId, habitId);
  }

  @ApiOperation({ summary: "Complete the day (add to streak)" })
  @ApiOkResponse({ type: CompleteDayResponse })
  @ApiBody({ type: CompleteDayDto })
  @Protected()
  @Post("day/complete")
  completeDay(@Authorized("id") userId: string, @Body() dto: CompleteDayDto) {
    return this.activityService.completeDay(userId, dto);
  }
}
