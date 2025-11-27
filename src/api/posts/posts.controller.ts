import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

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
}
