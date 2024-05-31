import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service'; //for ORM
import { ValidationService } from '../common/validation.service'; //for validation
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (1)
import { Logger } from 'winston'; //for logger (2)
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model'; //for request & address data model
import { Address, User } from '@prisma/client'; //import user & address prisma
import { AddressValidation } from './address.validation'; //for address validation
import { ContactService } from '../contact/contact.service'; //to get function from contact service
import { WebResponse } from '../model/web.model';

@Injectable()
export class AddressService {
  constructor(
    private validationService: ValidationService, //init validation
    private prismaService: PrismaService, //init ORM
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger, //init logger
    private contactService: ContactService, //init contact service to use contact service in address service
  ) {}

  async checkAddressMustExist(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      //find address data in DB
      where: {
        contact_id: contactId,
        id: addressId,
      },
    });

    if (!address) {
      //return 404 if address is not found
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Address is not found',
          error: 'Address is not found',
        },
        404,
      );
    }

    return address;
  }

  private toAddressResponse(addressResponse: AddressResponse): AddressResponse {
    return {
      id: addressResponse.id,
      street: addressResponse.street,
      city: addressResponse.city,
      province: addressResponse.province,
      country: addressResponse.country,
      postal_code: addressResponse.postal_code,
    };
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.create(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    ); //validate request
    await this.contactService.checkContactMustExist(
      user.username,
      request.contact_id,
    ); //use func checkContactMustExist in contact service

    const address = await this.prismaService.address.create({
      //insert address data to DB
      data: createRequest,
    });

    return this.toAddressResponse(address); //return address data
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.get(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log

    const contact = await this.contactService.checkContactMustExist(
      user.username,
      request.contact_id,
    );
    const address = await this.checkAddressMustExist(
      contact.id,
      request.address_id,
    );

    return this.toAddressResponse(address); //return address data
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.update(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    ); //validate request

    const contact = await this.contactService.checkContactMustExist(
      user.username,
      request.contact_id,
    );
    let address = await this.checkAddressMustExist(contact.id, request.id);

    address = await this.prismaService.address.update({
      //update address data
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
      data: updateRequest,
    });

    return this.toAddressResponse(address); //return address data
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.remove(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //log

    const contact = await this.contactService.checkContactMustExist(
      user.username,
      request.contact_id,
    );
    let address = await this.checkAddressMustExist(
      contact.id,
      request.address_id,
    );

    address = await this.prismaService.address.delete({
      //delete address
      where: {
        contact_id: address.contact_id,
        id: address.id,
      },
    });

    return this.toAddressResponse(address); //return address data
  }

  async list(
    user: User,
    contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    this.logger.debug(
      `AddressService.list(${JSON.stringify(user)},contactId: ${contactId})`,
    ); //request log

    await this.contactService.checkContactMustExist(user.username, contactId);

    const addresses = await this.prismaService.address.findMany({
      //get all address
      where: {
        contact_id: contactId,
      },
    });

    return {
      //return all address data
      statusCode: 200,
      message: 'Success get all address',
      data: addresses.map((address) => this.toAddressResponse(address)),
    };
  }
}
