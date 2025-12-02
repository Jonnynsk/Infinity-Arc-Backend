import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { CreateCommentRequest } from "./dto";

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
      const anyTx = tx as any;

      const comment = await anyTx.comment.create({
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

      await anyTx.socialStat.updateMany({
        where: {
          userId,
          title: "Comments",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      });

      return {
        ...comment,
        likesCount: 0,
        isLiked: false,
      };
    });
  }

  public async getComments(userId: string, postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const prisma: any = this.prismaService;

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
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

    if (!comments.length) {
      return [];
    }

    const likedCommentIds = await prisma.commentLike.findMany({
      where: {
        userId,
        commentId: {
          in: comments.map((comment) => comment.id),
        },
      },
      select: {
        commentId: true,
      },
    });

    const likedCommentIdsSet = new Set(
      likedCommentIds.map((like) => like.commentId),
    );

    return comments.map((comment) => ({
      ...comment,
      likesCount: 0,
      isLiked: likedCommentIdsSet.has(comment.id),
    }));
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
      const anyTx = tx as any;

      await anyTx.comment.delete({
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

  public async toggleLike(userId: string, commentId: string) {
    const prisma: any = this.prismaService;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return this.prismaService.$transaction(async (tx) => {
      const anyTx = tx as any;

      const existingLike = await anyTx.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      if (existingLike) {
        const updatedComment = await anyTx.comment.update({
          where: { id: commentId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
          select: {
            id: true,
            likesCount: true,
          },
        });

        await anyTx.commentLike.delete({
          where: { id: existingLike.id },
        });

        await anyTx.socialStat.updateMany({
          where: {
            userId: comment.userId,
            title: "Likes Received",
          },
          data: {
            value: {
              decrement: 1,
            },
          },
        });

        return {
          liked: false,
          likesCount: updatedComment.likesCount,
        };
      }

      await anyTx.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });

      const updatedComment = await anyTx.comment.update({
        where: { id: commentId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          likesCount: true,
        },
      });

      await anyTx.socialStat.updateMany({
        where: {
          userId: comment.userId,
          title: "Likes Received",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      });

      return {
        liked: true,
        likesCount: updatedComment.likesCount,
      };
    });
  }
}
