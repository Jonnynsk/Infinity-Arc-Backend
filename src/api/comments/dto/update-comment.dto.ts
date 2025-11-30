import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCommentRequest {
  @ApiProperty({
    description: "Updated text of the comment",
    example: "Updated comment text",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}
