import { ApiProperty } from "@nestjs/swagger";

export class DeleteHabitResponse {
  @ApiProperty({ example: "Habit deleted successfully" })
  message: string;
}
