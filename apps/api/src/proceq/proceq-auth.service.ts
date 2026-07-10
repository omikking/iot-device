import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { ProceqTokenDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

// Treat tokens expiring within this window as already expired so a token
// can't lapse mid-request between the validity check and the Proceq call.
const TOKEN_VALIDITY_BUFFER_MS = 60_000;

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return JSON.stringify(error.response?.data) || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// A 400/401 from the token endpoint means Proceq definitively rejected the
// refresh token (invalid_grant). Network errors and 5xx responses are
// transient and must NOT be treated as a dead token.
function isRefreshTokenRejected(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    (error.response?.status === 400 || error.response?.status === 401)
  );
}

@Injectable()
export class ProceqAuthService {
  private readonly logger = new Logger(ProceqAuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private async storeTokenInDB(
    token: ProceqTokenDto,
    email: string,
  ): Promise<void> {
    try {
      const expiresAt = new Date(token.expiresAt);

      await this.prisma.proceqToken.upsert({
        where: { operatorEmail: email },
        update: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: expiresAt,
          updatedAt: new Date(),
        },
        create: {
          operatorEmail: email,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: expiresAt,
        },
      });

      this.logger.log('Proceq token stored in database');
    } catch (error) {
      this.logger.error('Failed to store token in DB', error);
    }
  }

  private async refreshAndStoreToken(
    refreshToken: string,
    email: string,
  ): Promise<ProceqTokenDto> {
    try {
      const newToken = await this.refreshTokenFlow(refreshToken);
      await this.storeTokenInDB(newToken, email);
      return newToken;
    } catch (error) {
      this.logger.error('Failed to refresh and store token', error);
      throw error;
    }
  }

  private async deleteRejectedToken(email: string): Promise<void> {
    try {
      await this.prisma.proceqToken.deleteMany({
        where: { operatorEmail: email },
      });
      this.logger.warn(
        `Proceq refresh token for ${email} was rejected — token deleted, user must re-authorize`,
      );
    } catch (dbError) {
      this.logger.error(
        'Failed to delete rejected Proceq token',
        extractErrorMessage(dbError),
      );
    }
  }

  async setAuthorizationCode(code: string, email: string): Promise<void> {
    try {
      const newToken = await this.exchangeCodeForToken(code);
      await this.storeTokenInDB(newToken, email);

      this.logger.log(
        'Proceq access token acquired successfully via authorization code flow',
      );
    } catch (error) {
      this.logger.error(
        'Failed to exchange authorization code for token',
        extractErrorMessage(error),
      );
      throw new Error('Unable to authenticate with Proceq API');
    }
  }

  async authenticate(email: string): Promise<ProceqTokenDto> {
    const storedToken = await this.prisma.proceqToken.findUnique({
      where: { operatorEmail: email },
    });

    if (
      storedToken &&
      new Date(storedToken.expiresAt) >
        new Date(Date.now() + TOKEN_VALIDITY_BUFFER_MS)
    ) {
      return {
        accessToken: storedToken.accessToken,
        refreshToken: storedToken.refreshToken,
        expiresAt: storedToken.expiresAt.getTime(),
      };
    }

    if (storedToken?.refreshToken) {
      try {
        const newToken = await this.refreshAndStoreToken(
          storedToken.refreshToken,
          email,
        );
        return newToken;
      } catch (error) {
        this.logger.error(
          'Failed to refresh Proceq token',
          extractErrorMessage(error),
        );

        if (isRefreshTokenRejected(error)) {
          await this.deleteRejectedToken(email);
        }
      }
    }

    throw new Error(
      'Proceq authentication requires user authorization. Please visit the login endpoint.',
    );
  }

  getAuthorizationUrl(email: string, callbackUrl: string): string {
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const redirectUri = this.configService.get<string>('PROCEQ_REDIRECT_URI');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !redirectUri || !baseURL) {
      throw new Error('Missing Proceq OAuth configuration');
    }

    // Encode email and callbackUrl into the state
    const statePayload = Buffer.from(
      JSON.stringify({ email, callbackUrl }),
    ).toString('base64');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid email profile offline',
      state: statePayload,
    });
    return `https://${baseURL}/api/id/v1/auth/authorize?${params.toString()}`;
  }

  private async exchangeCodeForToken(
    authorizationCode: string,
  ): Promise<ProceqTokenDto> {
    this.logger.debug('Exchanging authorization code for Proceq token...');
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PROCEQ_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('PROCEQ_REDIRECT_URI');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Proceq client credentials or redirect URI');
    }

    const tokenUrl = `https://${baseURL}/api/id/v1/auth/token`;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', authorizationCode);
    params.append('redirect_uri', redirectUri);

    try {
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };
    } catch (error) {
      this.logger.error(
        'Failed to exchange authorization code for token',
        extractErrorMessage(error),
      );
      throw error;
    }
  }

  private async refreshTokenFlow(
    refreshToken: string,
  ): Promise<ProceqTokenDto> {
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PROCEQ_CLIENT_SECRET');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !clientSecret) {
      throw new Error('Missing Proceq client credentials');
    }

    const tokenUrl = `https://${baseURL}/api/id/v1/auth/token`;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
    });

    this.logger.debug('Proceq access token refreshed successfully');

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };
  }

  async getValidToken(email: string): Promise<ProceqTokenDto> {
    return this.authenticate(email);
  }

  async getAuthorizationHeader(
    email: string,
  ): Promise<{ Authorization: string }> {
    const token = await this.authenticate(email);
    return { Authorization: `Bearer ${token.accessToken}` };
  }

  async getTokenStatus(email: string) {
    const token = await this.prisma.proceqToken.findUnique({
      where: {
        operatorEmail: email,
      },
    });

    if (!token) {
      return {
        valid: false,
        canRefresh: false,
      };
    }

    const expiresInSeconds = Math.max(
      0,
      Math.floor((token.expiresAt.getTime() - Date.now()) / 1000),
    );
    const accessTokenValid = expiresInSeconds * 1000 > TOKEN_VALIDITY_BUFFER_MS;
    const canRefresh = Boolean(token.refreshToken);

    return {
      valid: accessTokenValid || canRefresh,
      canRefresh,
      expiresAt: token.expiresAt.toISOString(),
    };
  }
}
