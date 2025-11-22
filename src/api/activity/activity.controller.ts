import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { ActivityService } from "./activity.service";

import { CreateHabitRequest, ToggleCompletionDto, HabitResponse } from "./dto";
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
  @Protected()
  @Post("habits/toggle")
  toggleCompletion(
    @Authorized("id") userId: string,
    @Body() dto: ToggleCompletionDto,
  ) {
    return this.activityService.toggleCompletion(userId, dto);
  }

  @ApiOperation({ summary: "Delete a habit" })
  @Protected()
  @Delete("habits/:habitId")
  deleteHabit(
    @Authorized("id") userId: string,
    @Param("habitId") habitId: string,
  ) {
    return this.activityService.deleteHabit(userId, habitId);
  }
}
