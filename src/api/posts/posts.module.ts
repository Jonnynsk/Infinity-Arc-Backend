import { Module } from "@nestjs/common";

import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { InfraModule } from "src/infra/infra.module";

@Module({
  imports: [InfraModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
