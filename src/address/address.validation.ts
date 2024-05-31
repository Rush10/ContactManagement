import { z, ZodType } from 'zod'; //for zod module

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    //create validation
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    //update validation
    id: z.number().min(1).positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().min(1).positive(),
  });

  static readonly GET: ZodType = z.object({
    //get validation
    address_id: z.number().min(1).positive(),
    contact_id: z.number().min(1).positive(),
  });
}
