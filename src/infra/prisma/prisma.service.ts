import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  public async onModuleInit() {
    this.logger.log("Connecting to database...");

    try {
      await this.$connect();
      this.logger.log("Connected to database");
    } catch (error) {
      this.logger.error(
        "Failed to connect to database: ${error.message}",
        error,
      );
      throw error;
    }
  }

  public async onModuleDestroy() {
    this.logger.log("Disconnecting from database...");

    try {
      await this.$disconnect();
      this.logger.log("Disconnected from database");
    } catch (error) {
      this.logger.error(
        "Failed to disconnect from database: ${error.message}",
        error,
      );
      throw error;
    }
  }
}
