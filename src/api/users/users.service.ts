import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";
import { CloudinaryService } from "src/infra/cloudinary/cloudinary.service";

import { UpdateProfileRequest } from "./dto";

@Injectable()
export class UsersService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private calculateCurrentStreak(
    dayStreak: number | null,
    lastCompletedDay: Date | null,
  ): number {
    const now = new Date();
    const todayYear = now.getUTCFullYear();
    const todayMonth = now.getUTCMonth();
    const todayDay = now.getUTCDate();
    const today = new Date(Date.UTC(todayYear, todayMonth, todayDay));

    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    let currentStreak = dayStreak ?? 0;

    if (lastCompletedDay) {
      const lastCompleted = new Date(lastCompletedDay);
      const lastYear = lastCompleted.getUTCFullYear();
      const lastMonth = lastCompleted.getUTCMonth();
      const lastDay = lastCompleted.getUTCDate();
      const normalizedLastCompleted = new Date(
        Date.UTC(lastYear, lastMonth, lastDay),
      );

      if (normalizedLastCompleted.getTime() < yesterday.getTime()) {
        currentStreak = 0;
      }
    }

    return currentStreak;
  }

  public async getProfile(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        location: true,
        avatar: true,
        aboutMe: true,
        createdAt: true,
        dayStreak: true,
        lastCompletedDay: true,
        socialNetworks: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
        socialStats: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const currentStreak = this.calculateCurrentStreak(
      user.dayStreak,
      user.lastCompletedDay,
    );

    return {
      ...user,
      dayStreak: currentStreak,
    };
  }

  public async getUserByUsername(username: string, currentUserId?: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        location: true,
        avatar: true,
        aboutMe: true,
        createdAt: true,
        dayStreak: true,
        lastCompletedDay: true,
        socialNetworks: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
        socialStats: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const currentStreak = this.calculateCurrentStreak(
      user.dayStreak,
      user.lastCompletedDay,
    );

    let isFollowing = false;

    if (currentUserId && currentUserId !== user.id) {
      const follow = await this.prismaService.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });

      isFollowing = !!follow;
    }

    return {
      ...user,
      dayStreak: currentStreak,
      isFollowing,
    };
  }

  public async uploadAvatar(id: string, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);

    await this.prismaService.user.update({
      where: { id },
      data: { avatar: result.secure_url },
    });

    return { url: result.secure_url };
  }

  public async updateProfile(id: string, dto: UpdateProfileRequest) {
    const { socialNetworks, ...userData } = dto;

    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        ...userData,
        ...(socialNetworks !== undefined && {
          socialNetworks: {
            update: socialNetworks.map((sn) => ({
              where: { id: sn.id },
              data: { title: sn.title, link: sn.link },
            })),
          },
        }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        location: true,
        avatar: true,
        aboutMe: true,
        createdAt: true,
        dayStreak: true,
        lastCompletedDay: true,
        socialNetworks: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
      },
    });

    const currentStreak = this.calculateCurrentStreak(
      user.dayStreak,
      user.lastCompletedDay,
    );

    return {
      ...user,
      dayStreak: currentStreak,
    };
  }

  public async getTopUsersByStreak(limit: number = 5) {
    const users = await this.prismaService.user.findMany({
      where: {
        dayStreak: {
          gt: 0,
        },
      },
      orderBy: {
        dayStreak: "desc",
      },
      take: limit * 3,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        location: true,
        avatar: true,
        aboutMe: true,
        createdAt: true,
        dayStreak: true,
        lastCompletedDay: true,
        socialNetworks: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
        socialStats: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    });

    const usersWithRecalculatedStreak = users
      .map((user) => ({
        ...user,
        dayStreak: this.calculateCurrentStreak(
          user.dayStreak,
          user.lastCompletedDay,
        ),
      }))
      .filter((user) => user.dayStreak > 0)
      .sort((a, b) => b.dayStreak - a.dayStreak)
      .slice(0, limit);

    return usersWithRecalculatedStreak;
  }
}
