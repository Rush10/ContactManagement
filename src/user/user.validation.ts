import { z, ZodType } from 'zod'; //for zod module

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    //register validation
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    //login validation
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    //update validation
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
