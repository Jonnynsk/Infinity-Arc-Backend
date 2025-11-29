import { Module } from "@nestjs/common";

import { FollowsController } from "./follows.controller";
import { FollowsService } from "./follows.service";

import { PrismaModule } from "src/infra/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
