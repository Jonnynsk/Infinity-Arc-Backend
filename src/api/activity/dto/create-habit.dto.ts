import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateHabitRequest {
  @ApiProperty({
    description: "The title of the habit",
    example: "Drink water",
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
