import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service'; //for prisma

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {} //init prisma

  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['authorization'] as string; //define authorization to token

    if (token) {
      //check if token exist
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      }); //find user in db with the same token

      if (user) {
        //check if user with same token exist
        req.user = user; //save user in request user
      }
    }

    next();
  }
}
