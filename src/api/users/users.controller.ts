import { Controller, Get } from "@nestjs/common";
import type { User } from "@prisma/client";

import { UsersService } from "./users.service";

import { Authorized, Protected } from "src/common/decorators";

@Controller("users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Protected()
  @Get("@me")
  public async getMe(@Authorized() user: User) {
    return user;
  }
}
