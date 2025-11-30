import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { CreateCommentRequest, UpdateCommentRequest } from "./dto";

@Injectable()
export class CommentsService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createComment(
    userId: string,
    postId: string,
    dto: CreateCommentRequest,
  ) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.prismaService.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          content: dto.content,
          userId,
          postId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: {
          commentsCount: {
            increment: 1,
          },
        },
      });

      return comment;
    });
  }

  public async getComments(postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const comments = await this.prismaService.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return comments;
  }

  public async updateComment(
    userId: string,
    commentId: string,
    dto: UpdateCommentRequest,
  ) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You cannot update this comment");
    }

    return this.prismaService.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  public async deleteComment(userId: string, commentId: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, postId: true },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You cannot delete this comment");
    }

    return this.prismaService.$transaction(async (tx) => {
      await tx.comment.delete({
        where: { id: commentId },
      });

      await tx.post.update({
        where: { id: comment.postId },
        data: {
          commentsCount: {
            decrement: 1,
          },
        },
      });

      return { id: commentId };
    });
  }
}
