import { ApiProperty } from "@nestjs/swagger";

class PostImageResponse {
  @ApiProperty({
    description: "ID of the image",
    example: "img_123",
  })
  id: string;

  @ApiProperty({
    description: "Public URL of the image",
    example: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
  })
  url: string;
}

class PostAuthorResponse {
  @ApiProperty({ description: "User name", example: "Jonny Nash" })
  name: string;

  @ApiProperty({ description: "Username", example: "jonny.nash" })
  username: string;

  @ApiProperty({
    description: "URL of the avatar",
    example: "https://res.cloudinary.com/demo/image/upload/v1/avatar.jpg",
  })
  avatar: string;
}

export class PostResponse {
  @ApiProperty({
    description: "ID of the created post",
    example: "post_123",
  })
  id: string;

  @ApiProperty({ description: "Post author", type: PostAuthorResponse })
  user: PostAuthorResponse;

  @ApiProperty({
    description: "Text of the post",
    example: "Today I closed all the tasks on the project 💪",
  })
  content: string;

  @ApiProperty({ description: "Number of likes", example: 0 })
  likesCount: number;

  @ApiProperty({ description: "Number of comments", example: 0 })
  commentsCount: number;

  @ApiProperty({ description: "Number of reposts", example: 0 })
  repostsCount: number;

  @ApiProperty({
    description: "Date of creation",
    example: "2024-03-12T10:15:30.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date of last update",
    example: "2024-03-12T10:15:30.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Images attached to the post",
    type: [PostImageResponse],
    example: [{ id: "img_123", url: "https://..." }],
  })
  images: PostImageResponse[];
}
