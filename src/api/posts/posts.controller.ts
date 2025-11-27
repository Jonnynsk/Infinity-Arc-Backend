import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";

import { PostsService } from "./posts.service";
import { CreatePostRequest, PostResponse } from "./dto";
import { Authorized, Protected } from "src/common/decorators";

@Controller("posts")
export class PostsController {
  public constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: "Create a new post" })
  @ApiBody({ type: CreatePostRequest })
  @ApiOkResponse({
    description: "Post created successfully",
    type: PostResponse,
  })
  @Protected()
  @Post()
  public createPost(
    @Authorized("id") userId: string,
    @Body() dto: CreatePostRequest,
  ) {
    return this.postsService.createPost(userId, dto);
  }

  @ApiOperation({ summary: "Get feed posts" })
  @ApiOkResponse({
    description: "List of posts",
    type: PostResponse,
    isArray: true,
  })
  @Protected()
  @Get()
  public getPosts() {
    return this.postsService.getPosts();
  }

  @ApiOperation({ summary: "Delete post" })
  @ApiParam({ name: "postId", type: String })
  @ApiOkResponse({
    description: "Post deleted",
    schema: { properties: { id: { type: "string" } } },
  })
  @Protected()
  @Delete(":postId")
  public deletePost(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
  ) {
    return this.postsService.deletePost(userId, postId);
  }
}
