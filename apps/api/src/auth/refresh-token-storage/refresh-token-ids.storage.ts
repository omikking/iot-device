import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private prisma: PrismaService) {}

  async insert(userId: string, tokenId: string) {
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

  async validateAndReplace(
    userId: string,
    oldTokenId: string,
    newTokenId: string,
  ): Promise<boolean> {
    const result = await this.prisma.refreshTokenId.updateMany({
      where: {
        userId: this.getKey(userId),
        refreshTokenId: oldTokenId,
      },
      data: {
        refreshTokenId: newTokenId,
      },
    });

    return result.count > 0;
  }

  async validate(userId: string, tokenId: string) {
    const storedId = await this.prisma.refreshTokenId.findUnique({
      where: {
        userId: this.getKey(userId),
      },
    });

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
