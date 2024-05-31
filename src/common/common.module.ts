import {
  Global,
  MiddlewareConsumer, //for global decorator
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //for config module
import { WinstonModule } from 'nest-winston'; //for winston module (1)
import * as winston from 'winston'; //for winston module (2)
import { PrismaService } from './prisma.service'; //for prisma service
import { ValidationService } from './validation.service'; //for validation service
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from './auth.middleware';

@Global() //make common module accessable to other module
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug', //change this to change level ['debug','info','error','warn']
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }), //import winston module as root
    ConfigModule.forRoot({
      isGlobal: true,
    }), //import config nestjs module as root for .env
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService], //these service can be accessable to all file/module
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*'); //implement auth middleware to all api path
  }
}
