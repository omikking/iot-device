import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { errorTexts } from 'src/errorTexts/errorTexts';

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
      const normalizedEmail = dto.email.toLowerCase();

      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
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
          throw new ConflictException({
            code: 'USER_EMAIL_ALREADY_EXISTS',
            title: errorTexts.authEmailExists_title,
            message: errorTexts.authEmailExists_message,
          });
        }
      }

      throw new InternalServerErrorException({
        code: 'USER_SETUPACCOUNT_ERROR',
        title: errorTexts.authSetupAccountError_title,
        message: errorTexts.contactSupportError,
      });
    }
  }

  async signin(dto: SigninDto) {
    try {
      const normalizedEmail = dto.email.toLowerCase();
      const user = await this.prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          isDeleted: false,
        },
        include: {
          userRole: {
            select: {
              role: true,
              companyId: true,
              appsAccess: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException({
          code: 'USER_INVALID_CREDENTIALS_ERROR',
          title: errorTexts.authInvalidCredentials_title,
          message: errorTexts.authInvalidCredentials_message,
        });
      }

      const passwordMatch = await argon.verify(user.hash, dto.password);

      if (!passwordMatch) {
        throw new UnauthorizedException({
          code: 'USER_INVALID_CREDENTIALS_ERROR',
          title: errorTexts.authInvalidCredentials_title,
          message: errorTexts.authInvalidCredentials_message,
        });
      }

      const tokens = await this.generateTokens(user);

      const userResponse: ActiveUserData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        globalRole: user.globalRole,
        userPermissions: user.userRole.map((permission) => ({
          role: permission.role,
          companyId: permission.companyId,
          appsAccess: permission.appsAccess,
        })),
      };

      return {
        tokens: tokens,
        userData: userResponse,
      } as SignInResponseDto;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        code: 'USER_SIGNIN_ERROR',
        title: errorTexts.authInvalidCredentials_title,
        message: errorTexts.contactSupportError,
      });
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      console.log('Refresh token triggered');
      const payload = await this.jwt.verifyAsync(dto.refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: payload.sub,
          isDeleted: false, // Only refresh tokens for non-deleted users
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
        throw new UnauthorizedException({
          code: 'USER_INVALID_REFRESH_TOKEN',
          title: errorTexts.authRefreshTokenError_title,
        });
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        // Log or notify that someone is trying to use invalidated refresh token.
        // This is a security measure to log potential replay attacks or other malicious activity.
        throw new UnauthorizedException({
          code: 'USER_SESSION_EXPIRED',
          title: errorTexts.authAccessDenied_title,
        });
      }
      throw new UnauthorizedException({
        code: 'USER_AUTHENTICATION_ERROR',
        title: errorTexts.authUserError_title,
      });
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        user.id,
        user.globalRole ?? 'defaultRole',

        parseInt(this.config.get('JWT_ACCESS_TOKEN_TTL') ?? '600'),
        {
          email: user.email,
        },
      ),
      this.signToken(
        user.id,
        user.globalRole ?? 'defaultRole',

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

  private async signToken<T>(
    userId: string,
    globalRole: string,
    expiresIn: number,
    payload: T,
  ) {
    return await this.jwt.signAsync(
      {
        sub: userId,
        globalRole: globalRole,
        ...payload,
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: expiresIn,
      },
    );
  }
}
