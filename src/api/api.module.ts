import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ActivityModule } from "./activity/activity.module";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [AuthModule, UsersModule, ActivityModule, PostsModule],
})
export class ApiModule {}
