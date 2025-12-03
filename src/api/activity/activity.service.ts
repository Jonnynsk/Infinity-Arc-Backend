import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { CreateHabitRequest, ToggleCompletionDto, CompleteDayDto } from "./dto";

@Injectable()
export class ActivityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserHabits(userId: string) {
    const habits = await this.prismaService.habit.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        completions: {
          select: {
            id: true,
            date: true,
            createdAt: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return habits;
  }

  async createHabit(userId: string, dto: CreateHabitRequest) {
    const habit = await this.prismaService.habit.create({
      data: {
        title: dto.title,
        userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return habit;
  }

  async toggleCompletion(userId: string, dto: ToggleCompletionDto) {
    const { habitId, date } = dto;

    const habit = await this.prismaService.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException("Habit not found");
    }

    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = parsedDate.getUTCMonth();
    const day = parsedDate.getUTCDate();
    const normalizedDate = new Date(Date.UTC(year, month, day));

    const existingCompletion =
      await this.prismaService.habitCompletion.findUnique({
        where: {
          habitId_date: {
            habitId,
            date: normalizedDate,
          },
        },
      });

    if (existingCompletion) {
      await this.prismaService.habitCompletion.delete({
        where: {
          id: existingCompletion.id,
        },
      });

      return { completed: false };
    } else {
      await this.prismaService.habitCompletion.create({
        data: {
          habitId,
          date: normalizedDate,
        },
      });

      return { completed: true };
    }
  }

  async deleteHabit(userId: string, habitId: string) {
    const habit = await this.prismaService.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException("Habit not found");
    }

    await this.prismaService.habit.delete({
      where: {
        id: habitId,
      },
    });

    return { message: "Habit deleted successfully" };
  }

  async completeDay(userId: string, dto: CompleteDayDto) {
    const targetDate = dto.date ? new Date(dto.date) : new Date();
    const targetYear = targetDate.getUTCFullYear();
    const targetMonth = targetDate.getUTCMonth();
    const targetDay = targetDate.getUTCDate();
    const normalizedTargetDate = new Date(
      Date.UTC(targetYear, targetMonth, targetDay),
    );

    const now = new Date();
    const todayYear = now.getUTCFullYear();
    const todayMonth = now.getUTCMonth();
    const todayDay = now.getUTCDate();
    const today = new Date(Date.UTC(todayYear, todayMonth, todayDay));

    if (normalizedTargetDate > today) {
      throw new BadRequestException("Cannot complete future days");
    }

    const userHabits = await this.prismaService.habit.findMany({
      where: { userId },
    });

    if (userHabits.length === 0) {
      throw new BadRequestException("No habits found");
    }

    const completedHabits = await this.prismaService.habitCompletion.count({
      where: {
        habitId: { in: userHabits.map((h) => h.id) },
        date: normalizedTargetDate,
      },
    });

    if (completedHabits !== userHabits.length) {
      throw new BadRequestException(
        `Complete ${userHabits.length - completedHabits} more habit(s) to finish the day`,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        dayStreak: true,
        lastCompletedDay: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const existingCompletion =
      await this.prismaService.dayCompletion.findUnique({
        where: {
          userId_date: {
            userId,
            date: normalizedTargetDate,
          },
        },
      });

    if (existingCompletion) {
      throw new BadRequestException("Day already completed");
    }

    let newStreak = 1;
    const yesterday = new Date(normalizedTargetDate);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    if (user.lastCompletedDay) {
      const lastCompleted = new Date(user.lastCompletedDay);
      const lastYear = lastCompleted.getUTCFullYear();
      const lastMonth = lastCompleted.getUTCMonth();
      const lastDay = lastCompleted.getUTCDate();
      const normalizedLastCompleted = new Date(
        Date.UTC(lastYear, lastMonth, lastDay),
      );

      if (normalizedLastCompleted.getTime() === yesterday.getTime()) {
        newStreak = (user.dayStreak ?? 0) + 1;
      } else if (normalizedLastCompleted.getTime() < yesterday.getTime()) {
        newStreak = 1;
      } else {
        newStreak = user.dayStreak ?? 0;
      }
    }

    await this.prismaService.$transaction([
      this.prismaService.dayCompletion.create({
        data: {
          userId,
          date: normalizedTargetDate,
        },
      }),
      this.prismaService.user.update({
        where: { id: userId },
        data: {
          dayStreak: newStreak,
          lastCompletedDay: normalizedTargetDate,
        },
      }),
    ]);

    return {
      message: "Day completed successfully",
      dayStreak: newStreak,
      date: normalizedTargetDate,
    };
  }
}
