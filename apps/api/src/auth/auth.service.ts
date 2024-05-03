import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      console.log(dto);

      console.time('hash');
      const hash = await argon.hash(dto.password);
      console.log('hash', hash);
      console.timeEnd('hash');

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      delete (user as { hash?: string }).hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Credentials incorrect');

      const passwordMatch = await argon.verify(user.hash, dto.password);

      if (!passwordMatch) throw new ForbiddenException('Credentails incorrect');

      console.log('user', user);

      delete (user as { hash?: string }).hash;

      return user;
    } catch (error) {
      console.error('oh no!', error);
    }
  }
}
