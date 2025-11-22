import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { CreateHabitRequest, ToggleCompletionDto } from "./dto";

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

    const existingCompletion =
      await this.prismaService.habitCompletion.findUnique({
        where: {
          habitId_date: {
            habitId,
            date: parsedDate,
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
          date: parsedDate,
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
}
