import { Injectable, Inject, HttpException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service'; //for ORM
import { ValidationService } from '../common/validation.service'; //for validation
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (1)
import { Logger } from 'winston'; //for logger (2)
import {
  CreateContactRequest,
  ContactResponse,
  UpdateContactRequest,
  SearchContactRequest,
} from '../model/contact.model'; //for request & contact data model
import { ContactValidation } from './contact.validation';
import { Contact, User } from '@prisma/client'; //import user & contact prisma
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class ContactService {
  constructor(
    private validationService: ValidationService, //init validation
    private prismaService: PrismaService, //init ORM
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger, //init logger
  ) {}

  private toContactResponse(contactResponse: ContactResponse): ContactResponse {
    return {
      id: contactResponse.id,
      first_name: contactResponse.first_name,
      last_name: contactResponse.last_name,
      email: contactResponse.email,
      phone: contactResponse.phone,
    };
  }

  async checkContactMustExist(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      //find contact data in DB
      where: {
        username: username,
        id: contactId,
      },
    });

    if (!contact) {
      //return 404 if contact is not found
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Contact is not found',
          error: 'Contact is not found',
        },
        404,
      );
    }

    return contact;
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    ); //validate request

    const contact = await this.prismaService.contact.create({
      //insert contact data to DB
      data: {
        ...createRequest,
        ...{ username: user.username },
      },
    });

    return this.toContactResponse(contact); //return contact data
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.get(${JSON.stringify(user)},contactId: ${contactId})`,
    ); //request log

    const contact = await this.checkContactMustExist(user.username, contactId);

    return this.toContactResponse(contact); //return contact data
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.update(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log
    const updateRequest: UpdateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    ); //validate request

    let contact = await this.checkContactMustExist(user.username, request.id);

    contact = await this.prismaService.contact.update({
      //update user data
      where: {
        id: contact.id,
        username: contact.username,
      },
      data: updateRequest,
    });

    return this.toContactResponse(contact); //return contact data
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.remove(${JSON.stringify(user)},contactId: ${contactId})`,
    ); //log

    await this.checkContactMustExist(user.username, contactId);

    const contact = await this.prismaService.contact.delete({
      //delete contact
      where: {
        username: user.username,
        id: contactId,
      },
    });

    return this.toContactResponse(contact); //return contact data
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    this.logger.debug(
      `ContactService.search(${JSON.stringify(user)},${request})`,
    ); //request log
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    ); //validate request

    const filters = [];

    if (searchRequest.name) {
      //add name filter if search request name exist
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    if (searchRequest.email) {
      //add email filter if search request email exist
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    if (searchRequest.phone) {
      //add phone filter if search request phone exist
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size; //define skip for get contact query

    const contacts = await this.prismaService.contact.findMany({
      //find contact based on pagination
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.contact.count({
      //count total all user's contact data
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      //return contact data
      statusCode: 200,
      message: 'Success search contact',
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
