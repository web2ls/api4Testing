import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  
  const PORT = process.env.NODE_ENV === 'production' ? 10002 : 3000;

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', "frontend"));
  app.useStaticAssets(join(__dirname, "..", "assets"));
  await app.listen(PORT);
}
bootstrap();
