import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service'; //for prisma service
import * as bcrypt from 'bcrypt'; //for bcrypt

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {} //init prisma service

  //SERVICE FOR USER & CONTACT UNIT TEST
  async deleteUser() {
    //func to delete zero or many user that have same username
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test username',
      },
    });
  }

  async getUser() {
    //func to find unique user that have same username
    return this.prismaService.user.findUnique({
      where: {
        username: 'test username',
      },
    });
  }

  async createUser() {
    //func to create user
    await this.prismaService.user.create({
      data: {
        username: 'test username',
        password: await bcrypt.hash('test password', 10),
        name: 'test name',
        token: 'test token',
      },
    });
  }

  //SERVICE FOR CONTACT UNIT TEST
  async createContact(total: number) {
    //func to create contact for testing user
    if (total < 1) {
      total = 1;
    }

    for (let i = 1; i <= total; i++) {
      await this.prismaService.contact.create({
        data: {
          first_name: `test first name ${i}`,
          last_name: `test last name ${i}`,
          email: `test${i}@mail.com`,
          phone: `test phone ${i}`,
          username: 'test username',
        },
      });
    }
  }

  async deleteContact() {
    //func to delete zero or many contact that have same username
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test username',
      },
    });
  }

  async getContact() {
    //func to find first contact user that have same username
    return this.prismaService.contact.findFirst({
      where: {
        username: 'test username',
      },
    });
  }

  //SERVICE FOR ADDRESS UNIT TEST
  async createAddress(total: number) {
    //func to create address for testing user contact
    if (total < 1) {
      total = 1;
    }

    const contact = await this.getContact();

    for (let i = 1; i <= total; i++) {
      await this.prismaService.address.create({
        data: {
          street: `test street ${i}`,
          city: `test city ${i}`,
          province: `test province ${i}`,
          country: `test country ${i}`,
          postal_code: `postcode ${i}`,
          contact_id: contact.id,
        },
      });
    }
  }

  async deleteAddress() {
    //func to delete zero or many contact address user
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          username: 'test username',
        },
      },
    });
  }

  async getAddress() {
    //func to find first address contact user
    return this.prismaService.address.findFirst({
      where: {
        contact: {
          username: 'test username',
        },
      },
    });
  }
}
