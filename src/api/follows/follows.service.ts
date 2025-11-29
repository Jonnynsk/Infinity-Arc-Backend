import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class FollowsService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("Cannot follow yourself");
    }

    const followingUser = await this.prismaService.user.findUnique({
      where: { id: followingId },
    });

    if (!followingUser) {
      throw new NotFoundException("User not found");
    }

    const existingFollow = await this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException("Already following this user");
    }

    await this.prismaService.$transaction([
      this.prismaService.follow.create({
        data: {
          followerId,
          followingId,
        },
      }),
      this.prismaService.socialStat.updateMany({
        where: {
          userId: followerId,
          title: "Following",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      }),
      this.prismaService.socialStat.updateMany({
        where: {
          userId: followingId,
          title: "Followers",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      }),
    ]);

    return { success: true };
  }

  public async unfollowUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("Cannot unfollow yourself");
    }

    const follow = await this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException("You are not following this user");
    }

    await this.prismaService.$transaction([
      this.prismaService.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      }),
      this.prismaService.socialStat.updateMany({
        where: {
          userId: followerId,
          title: "Following",
        },
        data: {
          value: {
            decrement: 1,
          },
        },
      }),
      this.prismaService.socialStat.updateMany({
        where: {
          userId: followingId,
          title: "Followers",
        },
        data: {
          value: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { success: true };
  }

  public async getFollowing(userId: string) {
    const follows = await this.prismaService.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = follows.map((follow) => ({
      id: follow.following.id,
      name: follow.following.name,
      username: follow.following.username,
      avatar: follow.following.avatar,
      createdAt: follow.createdAt.toISOString(),
    }));

    return {
      users,
      total: users.length,
    };
  }

  public async getFollowers(userId: string) {
    const follows = await this.prismaService.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = follows.map((follow) => ({
      id: follow.follower.id,
      name: follow.follower.name,
      username: follow.follower.username,
      avatar: follow.follower.avatar,
      createdAt: follow.createdAt.toISOString(),
    }));

    return {
      users,
      total: users.length,
    };
  }
}
