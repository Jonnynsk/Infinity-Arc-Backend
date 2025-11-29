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
        avatar: true,
        aboutMe: true,
        createdAt: true,
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

    return user;
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
        avatar: true,
        aboutMe: true,
        createdAt: true,
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
        avatar: true,
        aboutMe: true,
        createdAt: true,
        socialNetworks: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
      },
    });

    return user;
  }
}
