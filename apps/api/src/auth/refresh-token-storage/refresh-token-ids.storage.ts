import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private prisma: PrismaService) {}

  async insert(userId: string, tokenId: string) {
    // Consider if this should be insert instead?
    await this.prisma.refreshTokenId.upsert({
      where: {
        userId: this.getKey(userId),
      },
      update: {
        refreshTokenId: tokenId,
      },
      create: {
        userId: this.getKey(userId),
        refreshTokenId: tokenId,
      },
    });
  }

  async validate(userId: string, tokenId: string) {
    console.log('validate', userId, tokenId);
    const storedId = await this.prisma.refreshTokenId.findUnique({
      where: {
        userId: this.getKey(userId),
      },
    });

    if (!storedId || storedId.refreshTokenId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }

    return true;
  }

  async invalidate(userId: string, tokenId: string) {
    await this.prisma.refreshTokenId.delete({
      where: {
        userId: this.getKey(userId),
        refreshTokenId: tokenId,
      },
    });
  }

  private getKey(userId: string) {
    return `user-${userId}`;
  }
}
