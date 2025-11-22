import { Module } from "@nestjs/common";

import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";

import { InfraModule } from "src/infra/infra.module";

@Module({
  imports: [InfraModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
