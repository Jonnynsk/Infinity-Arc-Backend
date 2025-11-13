import { DocumentBuilder } from "@nestjs/swagger";

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle("Infinity Arc API")
    .setDescription("API documentation for Infinity Arc application")
    .setVersion(process.env.npm_package_version || "1.0.0")
    .build();
}
