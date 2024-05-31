import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (Data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); //init request
    const user = request.user; //init request user to user

    if (user) {
      return user; //return user if user exist
    } else {
      throw new HttpException(
        {
          //return 401 if user does not exist
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
        401,
      );
    }
  },
);
