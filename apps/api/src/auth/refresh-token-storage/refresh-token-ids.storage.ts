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

    if (storedId?.refreshTokenId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }

    return storedId?.refreshTokenId === tokenId;
  }

  async invalidate(userId: string, tokenId: string) {
    await this.prisma.refreshTokenId.delete({
      where: {
        userId: this.getKey(userId),
        refreshTokenId: tokenId,
      },
    });
  }

  async invalidateAllForUser(userId: string) {
    await this.prisma.refreshTokenId.deleteMany({
      where: {
        userId: this.getKey(userId),
      },
    });
  }

  private getKey(userId: string) {
    return `user-${userId}`;
  }
}
