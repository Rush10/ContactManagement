import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'; //for winston module

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //Cross-Origin Resource Sharing (CORS) is a specification that enables truly open access across domain-boundaries.

  //winston module for global logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  await app.listen(process.env.PORT || 3000); //define port app = env.PORT or default 3000 
}
bootstrap();
