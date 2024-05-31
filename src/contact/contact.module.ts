import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService], //to use contact service in address service
})
export class ContactModule {}
