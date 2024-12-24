import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RefreshTokenDto,
  SignInResponseDto,
  SigninDto,
  SignupDto,
} from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-storage';
import { randomUUID } from 'crypto';
import { ActiveUserData } from './interfaces/active-user-data';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}
  async signup(dto: SignupDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          fullName: dto.fullName,
          workPlace: dto.workPlace,
          phoneNumber: dto.phoneNumber || undefined,
        },
      });

      return this.generateTokens(user);
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

    const tokens = await this.generateTokens(user);

    // Return companies user has access to
    const userCompanies = await this.prisma.userPermission.findMany({
      where: {
        userId: user.id,
      },
      select: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const userResponse: ActiveUserData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      companies: userCompanies.map((userCompany) => {
        return {
          id: userCompany.company.id,
          name: userCompany.company.name,
        };
      }),
    };

    return {
      tokens: tokens,
      userData: userResponse,
    } as SignInResponseDto;
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      console.log('refresh token triggered');
      const payload = await this.jwt.verifyAsync(dto.refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: payload.sub,
        },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        payload.refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(
          user.id,
          payload.refreshTokenId,
        );
      } else {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        // Log or notify that someone is trying to use invalidated refresh token.
        // This is a security measure to log potential replay attacks or other malicious activity.
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        user.id,
        parseInt(this.config.get('JWT_ACCESS_TOKEN_TTL') ?? '600'),
        {
          email: user.email,
        },
      ),
      this.signToken(
        user.id,
        parseInt(this.config.get('JWT_REFRESH_TOKEN_TTL') ?? '600'),
        {
          refreshTokenId,
        },
      ),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload: T) {
    return await this.jwt.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: expiresIn,
      },
    );
  }
}
