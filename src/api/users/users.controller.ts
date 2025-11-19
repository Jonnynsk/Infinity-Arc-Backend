import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { UsersService } from "./users.service";

import { Authorized, Protected } from "src/common/decorators";

import { GetProfileResponse } from "./dto";

@Controller("users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "Get the profile of the current user",
    description: "Get the profile of the current user",
  })
  @ApiOkResponse({ type: GetProfileResponse })
  @Protected()
  @Get("profile")
  public async getProfile(@Authorized("id") id: string) {
    return await this.usersService.getProfile(id);
  }
}
