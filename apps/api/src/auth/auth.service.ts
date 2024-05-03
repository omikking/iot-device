import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
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
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
