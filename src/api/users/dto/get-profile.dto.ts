import { ApiProperty } from "@nestjs/swagger";

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
    description: "The date the user was registered",
    example: "2025-01-01",
  })
  createdAt: string;
}
