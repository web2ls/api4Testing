import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  // const app = await NestFactory.create(AppModule);
  app.useStaticAssets(join(__dirname, '..', "frontend"));
  app.useStaticAssets(join(__dirname, "..", "assets"));
  await app.listen(3000);
}
bootstrap();
