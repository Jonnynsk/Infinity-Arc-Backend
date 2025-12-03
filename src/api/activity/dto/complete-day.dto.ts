import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class CompleteDayDto {
  @ApiProperty({
    description: "The date to complete (defaults to today)",
    example: "2025-01-01",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}

export class CompleteDayResponse {
  @ApiProperty({ example: "Day completed successfully" })
  message: string;

  @ApiProperty({ example: 5 })
  dayStreak: number;

  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  date: Date;
}
