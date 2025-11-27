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

  public getPosts() {
    return this.prismaService.post.findMany({
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
  }

  public createPost(userId: string, dto: CreatePostRequest) {
    const { content, images } = dto;

    return this.prismaService.post.create({
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
}
