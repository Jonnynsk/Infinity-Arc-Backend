import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class ToggleCompletionDto {
  @ApiProperty({
    description: "The id of the habit",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  habitId: string;

  @ApiProperty({
    description: "The date of the completion",
    example: "2025-01-01",
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class ToggleCompletionResponse {
  @ApiProperty({ example: true })
  completed: boolean;
}
