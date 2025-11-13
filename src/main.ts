import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

import { getCorsConfig, getSwaggerConfig } from "./config";
import { SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));

  app.enableCors(getCorsConfig(config));
  
  const swaggerConfig = getSwaggerConfig();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("/docs", app, swaggerDocument, {
    jsonDocumentUrl: "openapi.json",
  });

  const port = config.getOrThrow<number>("HTTP_PORT");
  const host = config.getOrThrow<string>("HTTP_HOST");

  try {
    await app.listen(port);

    logger.log(`Server is running on: ${host}`);
  } catch (error) {
    logger.error("Failed to start server: ${error.message}", error);
    process.exit(1);
  }
}
bootstrap();
