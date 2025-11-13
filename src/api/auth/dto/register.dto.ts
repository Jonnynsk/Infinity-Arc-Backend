import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterRequest {
  @ApiProperty({
    description: "The name of the user",
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(96)
  name: string;

  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(96)
  username: string;

  @ApiProperty({
    description: "The country of the user",
    example: "US",
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: "The email of the user",
    example: "john.doe@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  password: string;
}
