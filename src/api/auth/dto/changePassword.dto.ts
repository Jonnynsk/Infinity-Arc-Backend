import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordRequest {
  @ApiProperty({
    description: "The old password of the user",
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  oldPassword: string;

  @ApiProperty({
    description: "The new password of the user",
    example: "password456",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  newPassword: string;
}
