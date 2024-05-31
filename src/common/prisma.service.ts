import {
  Injectable,
  Inject, //for decorator inject
  OnModuleInit, //for implement on module init
} from '@nestjs/common';
import { Logger } from 'winston'; //for logger (1)
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (2)
import { PrismaClient, Prisma } from '@prisma/client'; //for prisma service

@Injectable() //extend prisma client
//implement on module init
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, //inject winston logger
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    }); //setup log
  }

  onModuleInit() {
    //register level to logger
    this.$on('info', (e) => {
      this.logger.info(e);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e);
    });
    this.$on('error', (e) => {
      this.logger.error(e);
    });
    this.$on('query', (e) => {
      this.logger.info(e);
    });
  }
}
