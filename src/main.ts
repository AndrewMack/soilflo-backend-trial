import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const appService: AppService = app.get(AppService);

  const appPort = appService.getAppPort();

  const logger: Logger = new Logger('Main');
  logger.log(`App is listening on port: ${appPort}`);

  await app.listen(appPort);
}
bootstrap();
