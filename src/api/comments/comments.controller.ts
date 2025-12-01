import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";

import { CommentsService } from "./comments.service";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
} from "./dto";
import { Authorized, Protected } from "src/common/decorators";

@Controller("posts/:postId/comments")
export class CommentsController {
  public constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "Create a new comment" })
  @ApiParam({ name: "postId", type: String })
  @ApiBody({ type: CreateCommentRequest })
  @ApiOkResponse({
    description: "Comment created successfully",
    type: CommentResponse,
  })
  @Protected()
  @Post()
  public createComment(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
    @Body() dto: CreateCommentRequest,
  ) {
    return this.commentsService.createComment(userId, postId, dto);
  }

  @ApiOperation({ summary: "Get comments for a post" })
  @ApiParam({ name: "postId", type: String })
  @ApiOkResponse({
    description: "List of comments",
    type: CommentResponse,
    isArray: true,
  })
  @Protected()
  @Get()
  public getComments(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
  ) {
    return this.commentsService.getComments(userId, postId);
  }

  @ApiOperation({ summary: "Update comment" })
  @ApiParam({ name: "postId", type: String })
  @ApiParam({ name: "commentId", type: String })
  @ApiBody({ type: UpdateCommentRequest })
  @ApiOkResponse({
    description: "Comment updated successfully",
    type: CommentResponse,
  })
  @Protected()
  @Patch(":commentId")
  public updateComment(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
    @Body() dto: UpdateCommentRequest,
  ) {
    return this.commentsService.updateComment(userId, commentId, dto);
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiParam({ name: "postId", type: String })
  @ApiParam({ name: "commentId", type: String })
  @ApiOkResponse({
    description: "Comment deleted",
    schema: { properties: { id: { type: "string" } } },
  })
  @Protected()
  @Delete(":commentId")
  public deleteComment(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
  ) {
    return this.commentsService.deleteComment(userId, commentId);
  }

  @ApiOperation({ summary: "Toggle like on comment" })
  @ApiParam({ name: "postId", type: String })
  @ApiParam({ name: "commentId", type: String })
  @ApiOkResponse({
    description: "Like toggled",
    schema: {
      properties: {
        liked: { type: "boolean" },
        likesCount: { type: "number" },
      },
    },
  })
  @Protected()
  @Post(":commentId/like")
  public toggleLike(
    @Authorized("id") userId: string,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
  ) {
    return this.commentsService.toggleLike(userId, commentId);
  }
}
