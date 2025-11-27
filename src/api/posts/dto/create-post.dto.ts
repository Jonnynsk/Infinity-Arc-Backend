import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreatePostRequest {
  @ApiProperty({
    description: "Text of the post",
    example: "Today I closed all the tasks on the project 💪",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: "List of already uploaded image URLs",
    example: ["https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(6)
  @IsOptional()
  images?: string[];
}
