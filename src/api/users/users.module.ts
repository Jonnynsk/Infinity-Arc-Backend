import { Module } from "@nestjs/common";

import { CloudinaryModule } from "src/infra/cloudinary/cloudinary.module";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
