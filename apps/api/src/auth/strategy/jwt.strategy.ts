import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async validate(payload: { sub: number; email: string }) {
    // JWT payload. It will be appended to user object on the request body. req.user
    // We get req.user in our custom decorator @User
    console.log('payload', payload);

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    // use dto later
    delete (user as { hash?: string }).hash;

    return user;
  }
}
