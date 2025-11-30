import { Module } from "@nestjs/common";

import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { InfraModule } from "src/infra/infra.module";

@Module({
  imports: [InfraModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
