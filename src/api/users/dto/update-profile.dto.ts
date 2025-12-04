import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

export class SocialNetworkInput {
  @ApiProperty({
    description: "The ID of the social network",
    example: "uuid-here",
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: "The title of the social network",
    example: "Instagram",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "The link of the social network",
    example: "https://instagram.com/infinity_arc",
    required: false,
  })
  @IsOptional()
  @IsString()
  link: string;
}

export class UpdateProfileRequest {
  @ApiProperty({
    description: "The name of the user",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(96)
  name?: string;

  @ApiProperty({
    description: "The bio of the user",
    example: "I am a software engineer and a full stack developer",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  @ApiProperty({
    description: "The location of the user",
    example: "San Francisco, CA",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: "The social networks of the user",
    type: [SocialNetworkInput],
    example: [
      {
        id: "uuid-1",
        title: "Instagram",
        link: "https://instagram.com/infinity_arc",
      },
      {
        id: "uuid-2",
        title: "Twitter",
        link: "https://twitter.com/infinity_arc",
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialNetworkInput)
  socialNetworks?: SocialNetworkInput[];
}
