import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import {
  BansheeCartItemType,
  BansheeOrderItemStatus,
  BansheeOrderStatus,
  GlobalRole,
  Prisma,
} from '@prisma/client';
import { SubmitOrderInput } from './dto/submit-order.input';
import { OrderFilterInput } from './dto/order-filter.input';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

@Injectable()
export class BansheeOrderService {
  private readonly logger = new Logger(BansheeOrderService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly orderInclude = {
    orderItems: {
      include: { bansheeRequest: true },
    },
    company: true,
  };

  async findAll(
    filter: OrderFilterInput | undefined,
    offset: number = 0,
    limit: number = 50,
    user: ActiveUserData,
  ) {
    const where: Prisma.BansheeOrderWhereInput = {};

    const allowedCompanyIds = getAllowedCompanyIds(user);
    if (allowedCompanyIds.length > 0) {
      where.companyId = { in: allowedCompanyIds };
    }

    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.companyId) {
      where.companyId = filter.companyId;
    }
    if (filter?.startDate || filter?.endDate) {
      where.createdAt = {};
      if (filter.startDate) where.createdAt.gte = filter.startDate;
      if (filter.endDate) where.createdAt.lte = filter.endDate;
    }

    const [totalRecords, results] = await this.prisma.$transaction([
      this.prisma.bansheeOrder.count({ where }),
      this.prisma.bansheeOrder.findMany({
        where,
        include: this.orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
    ]);

    return { totalRecords, results };
  }

  async findOne(id: string, user: ActiveUserData) {
    const order = await this.prisma.bansheeOrder.findUnique({
      where: { id },
      include: this.orderInclude,
    });

    if (!order) {
      throw new UserInputError(`Order with id ${id} not found`);
    }

    const allowedCompanyIds = getAllowedCompanyIds(user);
    if (
      allowedCompanyIds.length > 0 &&
      !allowedCompanyIds.includes(order.companyId)
    ) {
      throw new UserInputError(`Order with id ${id} not found`);
    }

    return order;
  }

  async submitOrder(input: SubmitOrderInput) {
    const { companyId } = input;

    const cartItems = await this.prisma.bansheeCartItem.findMany({
      where: { companyId },
    });

    if (cartItems.length === 0) {
      throw new UserInputError('Cart is empty. Cannot submit an order.');
    }

    const orderItemsData = cartItems.flatMap((item) => {
      const count =
        item.itemType === BansheeCartItemType.NEW_BANSHEE ? item.quantity : 1;
      return Array.from({ length: count }, () => ({
        itemType: item.itemType,
        status: BansheeOrderItemStatus.PENDING,
        bansheeRequestId: item.bansheeRequestId,
        name: item.name,
        quantity: 1,
        location: item.location,
        period: item.period,
      }));
    });

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.bansheeOrder.create({
        data: {
          status: BansheeOrderStatus.PENDING,
          attachments: input.attachments ?? [],
          comment: input.comment,
          companyId,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: this.orderInclude,
      });

      await tx.bansheeCartItem.deleteMany({
        where: { companyId },
      });

      return createdOrder;
    });

    this.logger.log(
      `Order ${order.id} created with ${cartItems.length} items for company ${companyId}`,
    );

    return order;
  }

  async cancelOrder(
    id: string,
    companyId: string | undefined,
    user: ActiveUserData,
  ) {
    const order = await this.prisma.bansheeOrder.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new UserInputError(`Order with id ${id} not found`);
    }

    if (
      order.companyId !== companyId &&
      user.globalRole !== GlobalRole.SANDVIK_ADMIN
    ) {
      throw new UserInputError('You can only cancel your own orders');
    }

    if (order.status === BansheeOrderStatus.CANCELLED) {
      throw new UserInputError('Order is already cancelled');
    }

    if (order.status === BansheeOrderStatus.COMPLETED) {
      throw new UserInputError('Cannot cancel a completed order');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.bansheeOrderItem.updateMany({
        where: {
          orderId: id,
          status: BansheeOrderItemStatus.PENDING,
        },
        data: { status: BansheeOrderItemStatus.CANCELLED },
      });

      return tx.bansheeOrder.update({
        where: { id },
        data: { status: BansheeOrderStatus.CANCELLED },
        include: this.orderInclude,
      });
    });
  }

  async fulfillOrderItem(id: string) {
    const orderItem = await this.prisma.bansheeOrderItem.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!orderItem) {
      throw new UserInputError(`OrderItem with id ${id} not found`);
    }

    if (orderItem.status !== BansheeOrderItemStatus.PENDING) {
      throw new UserInputError(
        `OrderItem is ${orderItem.status}, can only fulfill PENDING items`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.bansheeOrderItem.update({
        where: { id },
        data: { status: BansheeOrderItemStatus.FULFILLED },
        include: { bansheeRequest: true, order: true },
      });

      await this.recomputeOrderStatus(tx, orderItem.orderId);

      return updatedItem;
    });
  }

  async cancelOrderItem(id: string) {
    const orderItem = await this.prisma.bansheeOrderItem.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!orderItem) {
      throw new UserInputError(`OrderItem with id ${id} not found`);
    }

    if (orderItem.status !== BansheeOrderItemStatus.PENDING) {
      throw new UserInputError(
        `OrderItem is ${orderItem.status}, can only cancel PENDING items`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.bansheeOrderItem.update({
        where: { id },
        data: { status: BansheeOrderItemStatus.CANCELLED },
        include: { bansheeRequest: true, order: true },
      });

      await this.recomputeOrderStatus(tx, orderItem.orderId);

      return updatedItem;
    });
  }

  private async recomputeOrderStatus(
    tx: Prisma.TransactionClient,
    orderId: string,
  ) {
    const items = await tx.bansheeOrderItem.findMany({
      where: { orderId },
      select: { status: true },
    });

    const allFulfilled = items.every(
      (i) => i.status === BansheeOrderItemStatus.FULFILLED,
    );
    const allCancelled = items.every(
      (i) => i.status === BansheeOrderItemStatus.CANCELLED,
    );
    const someFulfilled = items.some(
      (i) => i.status === BansheeOrderItemStatus.FULFILLED,
    );
    const nonePending = items.every(
      (i) => i.status !== BansheeOrderItemStatus.PENDING,
    );

    let newStatus: BansheeOrderStatus;

    if (allFulfilled) {
      newStatus = BansheeOrderStatus.COMPLETED;
    } else if (allCancelled) {
      newStatus = BansheeOrderStatus.CANCELLED;
    } else if (someFulfilled && nonePending) {
      newStatus = BansheeOrderStatus.COMPLETED;
    } else if (someFulfilled) {
      newStatus = BansheeOrderStatus.PARTIALLY_COMPLETED;
    } else {
      return;
    }

    await tx.bansheeOrder.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }
}
