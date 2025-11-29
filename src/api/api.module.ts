import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ActivityModule } from "./activity/activity.module";
import { PostsModule } from "./posts/posts.module";
import { FollowsModule } from "./follows/follows.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ActivityModule,
    PostsModule,
    FollowsModule,
  ],
})
export class ApiModule {}
