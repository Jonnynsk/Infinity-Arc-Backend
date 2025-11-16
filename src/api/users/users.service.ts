import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

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
        createdAt: true,
      },
    });

    return user;
  }
}
