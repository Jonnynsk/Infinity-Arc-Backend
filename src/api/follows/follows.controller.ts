import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags, ApiBody } from "@nestjs/swagger";

import { FollowsService } from "./follows.service";

import { Authorized, Protected } from "src/common/decorators";

import { FollowUserRequest, UserListResponse } from "./dto";

@ApiTags("Follows")
@Controller("follows")
export class FollowsController {
  public constructor(private readonly followsService: FollowsService) {}

  @ApiOperation({
    summary: "Follow a user",
    description: "Subscribe to another user",
  })
  @ApiBody({ type: FollowUserRequest })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
      },
    },
  })
  @Protected()
  @Post()
  public async followUser(
    @Authorized("id") followerId: string,
    @Body() dto: FollowUserRequest,
  ) {
    return await this.followsService.followUser(followerId, dto.userId);
  }

  @ApiOperation({
    summary: "Unfollow a user",
    description: "Unsubscribe from a user",
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
      },
    },
  })
  @Protected()
  @Delete(":userId")
  public async unfollowUser(
    @Authorized("id") followerId: string,
    @Param("userId") followingId: string,
  ) {
    return await this.followsService.unfollowUser(followerId, followingId);
  }

  @ApiOperation({
    summary: "Get following list",
    description: "Get list of users that the current user is following",
  })
  @ApiOkResponse({ type: UserListResponse })
  @Protected()
  @Get("following")
  public async getFollowing(@Authorized("id") userId: string) {
    return await this.followsService.getFollowing(userId);
  }

  @ApiOperation({
    summary: "Get followers list",
    description: "Get list of users that are following the current user",
  })
  @ApiOkResponse({ type: UserListResponse })
  @Protected()
  @Get("followers")
  public async getFollowers(@Authorized("id") userId: string) {
    return await this.followsService.getFollowers(userId);
  }

  @ApiOperation({
    summary: "Get following list for a user",
    description: "Get list of users that a specific user is following",
  })
  @ApiOkResponse({ type: UserListResponse })
  @Protected()
  @Get("following/:userId")
  public async getUserFollowing(@Param("userId") userId: string) {
    return await this.followsService.getFollowing(userId);
  }

  @ApiOperation({
    summary: "Get followers list for a user",
    description: "Get list of users that are following a specific user",
  })
  @ApiOkResponse({ type: UserListResponse })
  @Protected()
  @Get("followers/:userId")
  public async getUserFollowers(@Param("userId") userId: string) {
    return await this.followsService.getFollowers(userId);
  }
}
