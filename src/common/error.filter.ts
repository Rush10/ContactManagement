import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod'; //for zod module

@Catch(ZodError, HttpException)
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse(); //init response template

    if (exception instanceof HttpException) {
      //return response for http exception
      response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception instanceof ZodError) {
      //return response for zod error
      response.status(400).json({
        statusCode: 400,
        message: 'Validation Error',
        error: exception.message,
      });
    } else {
      //return response except http exception and zod error
      response.status(500).json({
        statusCode: 500,
        message: 'Something Wrong',
        error: exception.message,
      });
    }
  }
}
