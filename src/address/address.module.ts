import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [ContactModule], //to use contact service in address service
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
