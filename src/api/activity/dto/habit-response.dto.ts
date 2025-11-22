import { ApiProperty } from "@nestjs/swagger";

export class HabitCompletionResponse {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;
  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  date: Date;
  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  createdAt: Date;
}

export class HabitResponse {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;
  @ApiProperty({ example: "Drink water" })
  title: string;
  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  createdAt: Date;
  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  updatedAt: Date;
  @ApiProperty({ type: [HabitCompletionResponse] })
  completions: HabitCompletionResponse[];
}
