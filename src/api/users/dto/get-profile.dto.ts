import { ApiProperty } from "@nestjs/swagger";

class SocialNetwork {
  @ApiProperty({
    description: "The id of the social network",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The title of the social network",
    example: "Twitter",
  })
  title: string;

  @ApiProperty({
    description: "The link of the social network",
    example: "https://twitter.com/john_doe",
  })
  link: string;
}

class SocialStat {
  @ApiProperty({
    description: "The id of the social stat",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The title of the social stat",
    example: "Followers",
  })
  title: string;

  @ApiProperty({
    description: "The value of the social stat",
    example: 1247,
  })
  value: number;
}

export class GetProfileResponse {
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
    description: "The email of the user",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "The country of the user",
    example: "US",
  })
  country: string;

  @ApiProperty({
    description: "The avatar URL of the user",
    example: "https://example.com/avatar.jpg",
  })
  avatar: string;

  @ApiProperty({
    description: "The bio of the user",
    example: "I am a software engineer and a full stack developer",
  })
  aboutMe: string;

  @ApiProperty({
    description: "The date the user was registered",
    example: "2025-01-01",
  })
  createdAt: string;

  @ApiProperty({
    description: "The social networks of the user",
    type: [SocialNetwork],
    example: [
      {
        id: "123",
        title: "Twitter",
        link: "https://twitter.com/john_doe",
      },
    ],
  })
  socialNetworks: SocialNetwork[];

  @ApiProperty({
    description: "The social stats of the user",
    type: [SocialStat],
    example: [
      { id: "123", title: "Followers", value: 1247 },
      { id: "124", title: "Following", value: 342 },
      { id: "125", title: "Posts", value: 156 },
      { id: "126", title: "Likes Received", value: 8924 },
      { id: "127", title: "Comments", value: 2145 },
    ],
  })
  socialStats: SocialStat[];

  @ApiProperty({
    description: "Whether the current user is following this user",
    example: true,
    required: false,
  })
  isFollowing?: boolean;
}
