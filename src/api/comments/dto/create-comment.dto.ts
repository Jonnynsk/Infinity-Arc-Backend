import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCommentRequest {
  @ApiProperty({
    description: "Text of the comment",
    example: "Great post! Keep it up!",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}
