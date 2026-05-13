import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import { BansheeCartItemType } from '@prisma/client';
import { AddCartItemInput } from './dto/add-cart-item.input';
import { UpdateNewBansheeCartItemInput } from './dto/update-new-banshee-cart-item.input';
import { Logger } from '@nestjs/common';

@Injectable()
export class BansheeCartService {
  private readonly logger = new Logger(BansheeCartService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly cartItemInclude = {
    bansheeRequest: true,
    company: true,
    site: true,
    level: true,
    drive: true,
    location: true,
  } as const;

  async getCartItemsStats(companyId: string) {
    const statsDbResponse = await this.prisma.bansheeCartItem.groupBy({
      by: ['itemType'],
      where: { companyId },
      _sum: {
        quantity: true,
      },
    });

    let newBanshee = 0;
    let serviceExisting = 0;
    for (const stat of statsDbResponse) {
      const qty = stat._sum.quantity ?? 0;

      switch (stat.itemType) {
        case BansheeCartItemType.NEW_BANSHEE:
          newBanshee = qty;
          break;

        case BansheeCartItemType.SERVICE_EXISTING:
          serviceExisting = qty;
          break;
      }
    }

    return {
      newBanshee,
      serviceExisting,
      total: newBanshee + serviceExisting,
    };
  }

  async getCartItems(companyId: string) {
    const data = await this.prisma.bansheeCartItem.findMany({
      where: { companyId },
      include: {
        bansheeRequest: {
          include: {
            location: true,
          },
        },
        company: true,
        site: true,
        level: true,
        drive: true,
        location: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return data;
  }

  async addCartItems(input: AddCartItemInput[]) {
    for (const item of input) {
      if (
        item.itemType === BansheeCartItemType.SERVICE_EXISTING &&
        !item.bansheeRequestId
      ) {
        throw new UserInputError(
          'bansheeRequestId is required for SERVICE_EXISTING items',
        );
      }
    }

    const bansheeRequestIds = input
      .filter(
        (item) =>
          item.itemType === BansheeCartItemType.SERVICE_EXISTING &&
          item.bansheeRequestId,
      )
      .map((item) => item.bansheeRequestId!);

    if (bansheeRequestIds.length > 0) {
      const existingRequests = await this.prisma.bansheeRequest.findMany({
        where: { id: { in: bansheeRequestIds } },
        select: { id: true },
      });
      const existingIds = new Set(existingRequests.map((r) => r.id));
      for (const id of bansheeRequestIds) {
        if (!existingIds.has(id)) {
          throw new UserInputError(
            `BansheeRequest with id ${id} does not exist`,
          );
        }
      }
    }

    const skipped: Array<{
      bansheeRequestId: string;
      serialNumber: string | null;
      reason: string;
    }> = [];
    const skippedKeys = new Set<string>();

    const serviceExistingPairs = input
      .filter(
        (item) =>
          item.itemType === BansheeCartItemType.SERVICE_EXISTING &&
          item.bansheeRequestId,
      )
      .map((item) => ({
        companyId: item.companyId,
        bansheeRequestId: item.bansheeRequestId!,
      }));

    if (serviceExistingPairs.length > 0) {
      const existingCartEntries = await this.prisma.bansheeCartItem.findMany({
        where: {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          OR: serviceExistingPairs.map((p) => ({
            companyId: p.companyId,
            bansheeRequestId: p.bansheeRequestId,
          })),
        },
        include: { bansheeRequest: { select: { serialNumber: true } } },
      });

      for (const entry of existingCartEntries) {
        if (!entry.bansheeRequestId) continue;
        const key = `${entry.companyId}::${entry.bansheeRequestId}`;
        if (skippedKeys.has(key)) continue;
        skippedKeys.add(key);
        skipped.push({
          bansheeRequestId: entry.bansheeRequestId,
          serialNumber: entry.bansheeRequest?.serialNumber ?? null,
          reason: 'Already in cart for this company',
        });
      }
    }

    const itemsToCreate = input.filter((item) => {
      if (
        item.itemType === BansheeCartItemType.SERVICE_EXISTING &&
        item.bansheeRequestId
      ) {
        const key = `${item.companyId}::${item.bansheeRequestId}`;
        return !skippedKeys.has(key);
      }
      return true;
    });

    const added =
      itemsToCreate.length > 0
        ? await this.prisma.$transaction(
            itemsToCreate.map((item) =>
              this.prisma.bansheeCartItem.create({
                data: {
                  itemType: item.itemType,
                  bansheeRequestId: item.bansheeRequestId,
                  name: item.name,
                  quantity: item.quantity ?? 1,
                  siteId: item.siteId,
                  levelId: item.levelId,
                  driveId: item.driveId,
                  locationId: item.locationId,
                  period: item.period,
                  companyId: item.companyId,
                },
                include: this.cartItemInclude,
              }),
            ),
          )
        : [];

    return { added, skipped };
  }

  async updateNewBansheeCartItem(
    companyId: string,
    cartItemId: string,
    input: UpdateNewBansheeCartItemInput,
  ) {
    const cartItem = await this.prisma.bansheeCartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new UserInputError(`CartItem with id ${cartItemId} not found`);
    }

    if (cartItem.companyId !== companyId) {
      throw new UserInputError(
        `CartItem ${cartItemId} does not belong to company ${companyId}`,
      );
    }

    if (cartItem.itemType !== BansheeCartItemType.NEW_BANSHEE) {
      throw new UserInputError(
        `CartItem ${cartItemId} is not a NEW_BANSHEE item`,
      );
    }

    return this.prisma.bansheeCartItem.update({
      where: { id: cartItemId },
      data: {
        ...(input.quantity !== undefined && { quantity: input.quantity }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.siteId !== undefined && { siteId: input.siteId }),
        ...(input.levelId !== undefined && { levelId: input.levelId }),
        ...(input.driveId !== undefined && { driveId: input.driveId }),
        ...(input.locationId !== undefined && { locationId: input.locationId }),
        ...(input.period !== undefined && { period: input.period }),
      },
      include: this.cartItemInclude,
    });
  }

  async deleteCartItem(id: string) {
    const cartItem = await this.prisma.bansheeCartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      throw new UserInputError(`CartItem with id ${id} not found`);
    }

    return this.prisma.bansheeCartItem.delete({
      where: { id },
      include: this.cartItemInclude,
    });
  }

  async clearCart(companyId: string) {
    await this.prisma.bansheeCartItem.deleteMany({
      where: { companyId },
    });
    return true;
  }
}
