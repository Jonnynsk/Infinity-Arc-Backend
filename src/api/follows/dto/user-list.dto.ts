import { ApiProperty } from "@nestjs/swagger";

export class UserListItem {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The id of the user",
  })
  id: string;

  @ApiProperty({
    description: "The name of the user",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  username: string;

  @ApiProperty({
    description: "The avatar URL of the user",
    example: "https://example.com/avatar.jpg",
  })
  avatar: string;

  @ApiProperty({
    description: "The date when the follow was created",
    example: "2025-01-01T00:00:00.000Z",
  })
  createdAt: string;
}

export class UserListResponse {
  @ApiProperty({
    description: "List of users",
    type: [UserListItem],
  })
  users: UserListItem[];

  @ApiProperty({
    description: "Total count of users",
    example: 10,
  })
  total: number;
}
