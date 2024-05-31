import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod'; //for zod module

@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType<T>, data: T): T {
    //function validate using zod
    return zodType.parse(data);
  }
}
