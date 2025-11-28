import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "src/infra/prisma/prisma.service";

import { CreatePostRequest } from "./dto";

@Injectable()
export class PostsService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getPosts(userId: string) {
    const posts = await this.prismaService.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        likesCount: true,
        commentsCount: true,
        repostsCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    const likedPostIds = await this.prismaService.postLike.findMany({
      where: {
        userId,
        postId: {
          in: posts.map((post) => post.id),
        },
      },
      select: {
        postId: true,
      },
    });

    const savedPostIds = await this.prismaService.savedPost.findMany({
      where: {
        userId,
        postId: {
          in: posts.map((post) => post.id),
        },
      },
      select: {
        postId: true,
      },
    });

    const likedPostIdsSet = new Set(likedPostIds.map((like) => like.postId));
    const savedPostIdsSet = new Set(savedPostIds.map((saved) => saved.postId));

    return posts.map((post) => ({
      ...post,
      isLiked: likedPostIdsSet.has(post.id),
      isSaved: savedPostIdsSet.has(post.id),
    }));
  }

  public async createPost(userId: string, dto: CreatePostRequest) {
    const { content, images } = dto;

    return this.prismaService.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          content,
          userId,
          ...(images?.length && {
            images: {
              create: images.map((url) => ({ url })),
            },
          }),
        },
        select: {
          id: true,
          content: true,
          likesCount: true,
          commentsCount: true,
          repostsCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              username: true,
              avatar: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });

      await tx.socialStat.updateMany({
        where: {
          userId,
          title: "Posts",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      });

      return {
        ...post,
        isLiked: false,
        isSaved: false,
      };
    });
  }

  public async deletePost(userId: string, postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("You cannot delete this post");
    }

    await this.prismaService.post.delete({
      where: { id: postId },
    });

    return { id: postId };
  }

  public async toggleLike(userId: string, postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.prismaService.$transaction(async (tx) => {
      const existingLike = await tx.postLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        const updatedPost = await tx.post.update({
          where: { id: postId },
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

        await tx.postLike.delete({
          where: { id: existingLike.id },
        });

        await tx.socialStat.updateMany({
          where: {
            userId: post.userId,
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
          likesCount: updatedPost.likesCount,
        };
      }

      await tx.postLike.create({
        data: {
          userId,
          postId,
        },
      });

      const updatedPost = await tx.post.update({
        where: { id: postId },
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

      await tx.socialStat.updateMany({
        where: {
          userId: post.userId,
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
        likesCount: updatedPost.likesCount,
      };
    });
  }

  public async getSavedPosts(userId: string) {
    const savedPosts = await this.prismaService.savedPost.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        post: {
          select: {
            id: true,
            content: true,
            likesCount: true,
            commentsCount: true,
            repostsCount: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
              },
            },
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    const posts = savedPosts.map((saved) => saved.post);

    const likedPostIds = await this.prismaService.postLike.findMany({
      where: {
        userId,
        postId: {
          in: posts.map((post) => post.id),
        },
      },
      select: {
        postId: true,
      },
    });

    const likedPostIdsSet = new Set(likedPostIds.map((like) => like.postId));

    return posts.map((post) => ({
      ...post,
      isLiked: likedPostIdsSet.has(post.id),
      isSaved: true,
    }));
  }

  public async toggleSave(userId: string, postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.prismaService.$transaction(async (tx) => {
      const existingSaved = await tx.savedPost.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingSaved) {
        await tx.savedPost.delete({
          where: { id: existingSaved.id },
        });

        return {
          saved: false,
        };
      }

      await tx.savedPost.create({
        data: {
          userId,
          postId,
        },
      });

      return {
        saved: true,
      };
    });
  }
}
