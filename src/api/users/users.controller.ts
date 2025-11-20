import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";

import { Authorized, Protected } from "src/common/decorators";

import { GetProfileResponse, UpdateProfileRequest } from "./dto";

@ApiTags("Users")
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

  @ApiOperation({
    summary: "Update the profile of the current user",
    description: "Update the profile of the current user",
  })
  @ApiBody({ type: UpdateProfileRequest })
  @ApiOkResponse({ type: GetProfileResponse })
  @Protected()
  @Patch("profile")
  public async updateProfile(
    @Authorized("id") id: string,
    @Body() dto: UpdateProfileRequest,
  ) {
    return await this.usersService.updateProfile(id, dto);
  }
}
