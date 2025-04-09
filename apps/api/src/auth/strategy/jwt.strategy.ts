import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ActiveUserData } from '../interfaces/active-user-data';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // JWT payload. It will be appended to user object on the request body. req.user
    // We get req.user in our custom decorator @User
    // Alternatively, we could add user data to the JWT payload directly and return it here. Then we could avoid a Prisma DB call.
    try {
      const prismaUser = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: payload.sub,
        },
      });

      const activeUser: ActiveUserData = {
        id: prismaUser.id,
        email: prismaUser.email,
        fullName: prismaUser.fullName,
        globalRole: prismaUser.globalRole,
      };

      return activeUser;
    } catch (error) {
      if (error.code === 'P2025') {
        console.error('User not found');
        throw new UnauthorizedException();
      }
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
