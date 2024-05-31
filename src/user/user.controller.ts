import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service'; //for user service
import { WebResponse } from 'src/model/web.model'; //for web or response model
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model'; //for request & user data model
import { Auth } from '../common/auth.decorator'; //for auth
import { User } from '@prisma/client'; //import user prisma

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {} //init user service

  @Post('/v1/register') //POST /api/users/v1/register
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    //define request and response data type
    const result = await this.userService.register(request); //call register func from user service
    return {
      //return response
      statusCode: 200,
      message: 'Register Success',
      data: result,
    };
  }

  @Post('/v1/login') //POST /api/users/v1/login
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    //define request and response data type
    const result = await this.userService.login(request); //call login func from user service
    return {
      //return response
      statusCode: 200,
      message: 'Login Success',
      data: result,
    };
  }

  @Get('/v1/current') //GET /api/users/v1/current
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    //define request and response data type
    const result = await this.userService.get(user); //call get func from user service
    return {
      //return response
      statusCode: 200,
      message: 'Get current user success',
      data: result,
    };
  }

  @Patch('/v1/current') //PATCH /api/users/v1/current
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    //define request and response data type
    const result = await this.userService.update(user, request); //call udpate func from user service
    return {
      //return response
      statusCode: 200,
      message: 'Update current user success',
      data: result,
    };
  }

  @Delete('/v1/current') //DELETE /api/users/v1/current
  @HttpCode(200)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    //define request and response data type
    await this.userService.logout(user); //call logout func from user service
    return {
      //return response
      statusCode: 200,
      message: 'Logout success',
      data: true,
    };
  }
}
