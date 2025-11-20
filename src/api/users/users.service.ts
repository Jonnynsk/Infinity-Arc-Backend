import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { UpdateProfileRequest } from "./dto";

@Injectable()
export class UsersService {
  public constructor(private readonly prismaService: PrismaService) {}

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
