import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service'; //for address service
import { Auth } from '../common/auth.decorator'; //for authentication
import { User } from '@prisma/client'; //for orm
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model'; //for request & address data model
import { WebResponse } from '../model/web.model'; //for web or response model

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {} //init address service

  @Post('/v1') //POST /api/contacts/:contactId/addresses/v1
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    //define request and response data type
    request.contact_id = contactId; //add contact id to request id
    const result = await this.addressService.create(user, request); //call create func from address service
    return {
      //return response
      statusCode: 201,
      message: 'Create Address Success',
      data: result,
    };
  }

  @Get('/v1/:addressId') //GET /api/contacts/:contactId/addresses/v1/:addressId
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<AddressResponse>> {
    //define request and response data type
    const request: GetAddressRequest = {
      address_id: addressId,
      contact_id: contactId,
    };
    const result = await this.addressService.get(user, request); //call get func from address service
    return {
      //return response
      statusCode: 200,
      message: 'Get specific address contact user success',
      data: result,
    };
  }

  @Put('/v1/:addressId') //PUT /api/contacts/:contactId/addresses/v1/:addressId
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    //define request and response data type
    request.id = addressId; //add address id to request id
    request.contact_id = contactId; //add contact id to request contact_id
    const result = await this.addressService.update(user, request); //call update func from address service
    return {
      //return response
      statusCode: 200,
      message: 'Update address success',
      data: result,
    };
  }

  @Delete('/v1/:addressId') //DELETE /api/contacts/:contactId/addresses/v1/:addressId
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<boolean>> {
    //define request and response data type
    const request: RemoveAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };
    await this.addressService.remove(user, request); //call delete func from address service
    return {
      //return response
      statusCode: 200,
      message: 'Remove address success',
      data: true,
    };
  }

  @Get('/v1') //GET /api/contacts/:contactId/addresses/v1
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    //define request and response data type
    return this.addressService.list(user, contactId); //return response
  }
}
