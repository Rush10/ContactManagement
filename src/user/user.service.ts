import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston'; //for logger (1)
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (2)
import { PrismaService } from '../common/prisma.service'; //for ORM
import { ValidationService } from '../common/validation.service'; //for validation
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model'; //import model for request and response
import { UserValidation } from './user.validation'; //import validation for request
import * as bcrypt from 'bcrypt'; //for encryption using bcrypt
import { v4 as uuid } from 'uuid'; //for token using uuid
import { User } from '@prisma/client'; //import user prisma

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService, //init validation
    private prismaService: PrismaService, //init ORM
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger, //init logger
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.register(${JSON.stringify(request)})`); //request log
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request); //validate request

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    }); //get total user with same username

    if (totalUserWithSameUsername != 0) {
      //throw exception 400 if there is user with same username in DB
      // throw new HttpException('Username already exist', 400);
      throw new HttpException(
        {
          statusCode: 400,
          message: 'Validation Error',
          error: 'Username already exist',
        },
        400,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10); //bcrypt password

    await this.prismaService.user.create({
      //insert user data to DB
      data: registerRequest,
    });

    return {
      //return user data
      username: registerRequest.username,
      name: registerRequest.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`); //request log
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ); //validate request

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    }); //get user with same username

    if (!user) {
      //throw exception 401 if user is not in DB
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Username or password is invalid',
          error: 'Username or password is invalid',
        },
        401,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    ); //compare password in request and password in DB

    if (!isPasswordValid) {
      //throw exception 401 if user input wrong password
      throw new HttpException(
        {
          statusCode: 401,
          message: 'Username or password is invalid',
          error: 'Username or password is invalid',
        },
        401,
      );
    }

    user = await this.prismaService.user.update({
      //update user token column
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      //return user data with token
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.get(${JSON.stringify(user)})`); //log

    return {
      //return user data
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)},${JSON.stringify(request)})`,
    ); //request log
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    ); //validate request

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10); //bcrypt password
    }

    const result = await this.prismaService.user.update({
      //update user data
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      //return user data
      username: result.username,
      name: result.name,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.logout(${JSON.stringify(user)})`); //log

    const result = await this.prismaService.user.update({
      //delete user token
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return {
      //return user data
      username: result.username,
      name: result.name,
    };
  }
}
