import { z, ZodType } from 'zod'; //for zod module

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    //create validation
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    //udpate validation
    id: z.number().min(1).positive(),
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    //search validation
    name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).positive(),
  });
}
