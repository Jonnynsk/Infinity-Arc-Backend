import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

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
    summary: "Get top users by day streak",
    description: "Get top 5 users with the highest day streak",
  })
  @ApiOkResponse({ type: [GetProfileResponse] })
  @Protected()
  @Get("top")
  public async getTopUsersByStreak(@Query("limit") limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : 5;
    const limitNum =
      !Number.isNaN(parsed) && parsed > 0 && Number.isFinite(parsed)
        ? parsed
        : 5;
    return await this.usersService.getTopUsersByStreak(limitNum);
  }

  @ApiOperation({
    summary: "Get user by username",
    description: "Get user information by username",
  })
  @ApiOkResponse({ type: GetProfileResponse })
  @Protected()
  @Get(":username")
  public async getUserByUsername(
    @Param("username") username: string,
    @Authorized("id") currentUserId: string,
  ) {
    return await this.usersService.getUserByUsername(username, currentUserId);
  }

  @ApiOperation({
    summary: "Upload avatar for the current user",
    description: "Upload avatar image to Cloudinary",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        avatar: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
        },
      },
    },
  })
  @Protected()
  @Post("avatar")
  @UseInterceptors(
    FileInterceptor("avatar", {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new Error("Only image files are allowed!"), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  public async uploadAvatar(
    @Authorized("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadAvatar(id, file);
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
