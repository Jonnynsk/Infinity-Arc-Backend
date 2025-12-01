import { ApiProperty } from "@nestjs/swagger";

class CommentAuthorResponse {
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

export class CommentResponse {
  @ApiProperty({
    description: "ID of the comment",
    example: "comment_123",
  })
  id: string;

  @ApiProperty({ description: "Comment author", type: CommentAuthorResponse })
  user: CommentAuthorResponse;

  @ApiProperty({ description: "Comment author", type: CommentAuthorResponse })
  @ApiProperty({
    description: "Text of the comment",
    example: "Great post! Keep it up!",
  })
  content: string;

  @ApiProperty({
    description: "Number of likes",
    example: 0,
  })
  likesCount: number;

  @ApiProperty({
    description: "Whether the current user liked this comment",
    example: false,
  })
  isLiked: boolean;

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
}
