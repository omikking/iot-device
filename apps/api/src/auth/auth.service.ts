import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SignInResponseDto,
  SigninDto,
  SignupDto,
  UserResponseDto,
} from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignupDto) {
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

      // delete user.hash;
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }
      }
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passwordMatch = await argon.verify(user.hash, dto.password);

    if (!passwordMatch) throw new ForbiddenException('Credentails incorrect');

    console.log('user', user);

    // return this.signToken(user.id, user.email);

    const tokens = await this.signToken(user.id, user.email);

    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      tokens: tokens,
      userData: userResponse,
    } as SignInResponseDto;
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: parseInt(this.config.get('JWT_ACCESS_TOKEN_TTL') ?? '600'),
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      accessToken: token,
    };
  }
}
