import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from './users/users.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [AuthModule, UsersModule, ActivityModule],
})
export class ApiModule {}
