import {
  Controller,
  Post,
  Get,
  HttpCode,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service'; //for contact service
import {
  CreateContactRequest,
  ContactResponse,
  UpdateContactRequest,
  SearchContactRequest,
} from '../model/contact.model'; //for request & contact data model
import { WebResponse } from '../model/web.model'; //for web or response model
import { Auth } from '../common/auth.decorator'; //for authentication
import { User } from '@prisma/client'; //for orm

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {} //init contact service

  @Post('/v1') //POST /api/contacts/v1
  @HttpCode(201)
  async register(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    //define request and response data type
    const result = await this.contactService.create(user, request); //call create func from contact service
    return {
      //return response
      statusCode: 201,
      message: 'Create Contact Success',
      data: result,
    };
  }

  @Get('/v1/:contactId') //GET /api/contacts/v1/:contactId
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    //define request and response data type
    const result = await this.contactService.get(user, contactId); //call get func from contact service
    return {
      //return response
      statusCode: 200,
      message: 'Get specific contact user success',
      data: result,
    };
  }

  @Put('/v1/:contactId') //PUT /api/contacts/v1/:contactId
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    //define request and response data type
    request.id = contactId; //add contact id to request id
    const result = await this.contactService.update(user, request); //call udpate func from contact service
    return {
      //return response
      statusCode: 200,
      message: 'Update contact success',
      data: result,
    };
  }

  @Delete('/v1/:contactId') //DELETE /api/contacts/v1/:contactId
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<boolean>> {
    //define request and response data type
    await this.contactService.remove(user, contactId); //call get func from contact service
    return {
      //return response
      statusCode: 200,
      message: 'Remove contact success',
      data: true,
    };
  }

  @Get('/v1') //GET /api/contacts/v1
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    //define request and response data type
    const request: SearchContactRequest = {
      //define request value
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10,
    };

    return this.contactService.search(user, request); //return response
  }
}
