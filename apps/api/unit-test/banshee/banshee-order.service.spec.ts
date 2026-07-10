import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeOrderService } from 'src/banshee-order/banshee-order.service';
import {
  BansheeCartItemType,
  BansheeOrderItemStatus,
  BansheeOrderStatus,
} from '@prisma/client';
import {
  PrismaMock,
  adminUser,
  createPrismaMock,
  makeCompanyUser,
} from '../test-utils';

/**
 * Banshee Order API — unit tests.
 *
 * Covers smoke cases BE-ORD-01 .. BE-ORD-05 plus extended coverage of company
 * scoping, ownership checks, batch fulfillment and order-status recomputation.
 */
describe('BansheeOrderService', () => {
  let prisma: PrismaMock;
  let service: BansheeOrderService;
  let bansheeCommunicationService: { shareOrderDetails: jest.Mock };

  const companyId = 'company-1';

  beforeEach(() => {
    prisma = createPrismaMock();
    bansheeCommunicationService = {
      shareOrderDetails: jest.fn().mockResolvedValue(undefined),
    };
    service = new BansheeOrderService(
      prisma as unknown as PrismaService,
      bansheeCommunicationService as any,
    );
  });

  describe('BE-ORD-01: submit order from cart', () => {
    it('creates a PENDING order, expands items by quantity and clears the cart', async () => {
      prisma.bansheeCartItem.findMany.mockResolvedValue([
        { itemType: BansheeCartItemType.NEW_BANSHEE, quantity: 2, name: 'New' },
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          quantity: 1,
          bansheeRequestId: 'req-1',
        },
      ]);
      prisma.bansheeOrder.create.mockResolvedValue({
        id: 'order-1',
        status: BansheeOrderStatus.PENDING,
      });
      prisma.bansheeCartItem.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.submitOrder(
        {
          companyId,
          comment: 'Please process',
        } as any,
        [],
        adminUser,
      );

      expect(result.id).toBe('order-1');
      const createArg = prisma.bansheeOrder.create.mock.calls[0][0];
      expect(createArg.data.status).toBe(BansheeOrderStatus.PENDING);
      // NEW_BANSHEE qty 2 -> 2 items, SERVICE_EXISTING -> 1 item = 3 order items.
      expect(createArg.data.orderItems.create).toHaveLength(3);
      expect(prisma.bansheeCartItem.deleteMany).toHaveBeenCalledWith({
        where: { companyId },
      });
      // The created order (with the uploaded files) is handed off for the
      // order-details notification.
      expect(
        bansheeCommunicationService.shareOrderDetails,
      ).toHaveBeenCalledWith(result, adminUser, []);
    });

    it('still resolves the order when the notification email fails', async () => {
      prisma.bansheeCartItem.findMany.mockResolvedValue([
        { itemType: BansheeCartItemType.NEW_BANSHEE, quantity: 1, name: 'New' },
      ]);
      prisma.bansheeOrder.create.mockResolvedValue({
        id: 'order-1',
        status: BansheeOrderStatus.PENDING,
      });
      prisma.bansheeCartItem.deleteMany.mockResolvedValue({ count: 1 });
      bansheeCommunicationService.shareOrderDetails.mockRejectedValue(
        new Error('SMTP down'),
      );

      const result = await service.submitOrder(
        { companyId, comment: 'x' } as any,
        [],
        adminUser,
      );

      expect(result.id).toBe('order-1');
    });

    it('rejects submitting an order from an empty cart', async () => {
      prisma.bansheeCartItem.findMany.mockResolvedValue([]);

      await expect(
        service.submitOrder({ companyId, comment: 'x' } as any, [], adminUser),
      ).rejects.toThrow('Cart is empty. Cannot submit an order.');
      expect(prisma.bansheeOrder.create).not.toHaveBeenCalled();
    });
  });

  describe('BE-ORD-02: list orders with filter', () => {
    it('applies status / company / date filters and returns totalRecords + results', async () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-02-01');
      const results = [{ id: 'order-1' }];
      prisma.bansheeOrder.count.mockResolvedValue(7);
      prisma.bansheeOrder.findMany.mockResolvedValue(results);

      const result = await service.findAll(
        {
          status: BansheeOrderStatus.PENDING,
          companyId,
          startDate,
          endDate,
        } as any,
        10,
        20,
        adminUser,
      );

      expect(result).toEqual({ totalRecords: 7, results });
      const where = prisma.bansheeOrder.findMany.mock.calls[0][0].where;
      expect(where.status).toBe(BansheeOrderStatus.PENDING);
      expect(where.companyId).toBe(companyId);
      expect(where.createdAt).toEqual({ gte: startDate, lte: endDate });
      const findManyArg = prisma.bansheeOrder.findMany.mock.calls[0][0];
      expect(findManyArg.skip).toBe(10);
      expect(findManyArg.take).toBe(20);
    });

    it('scopes a non-admin user to their allowed companies', async () => {
      prisma.bansheeOrder.count.mockResolvedValue(0);
      prisma.bansheeOrder.findMany.mockResolvedValue([]);

      await service.findAll(undefined, 0, 50, makeCompanyUser(companyId));

      expect(prisma.bansheeOrder.findMany.mock.calls[0][0].where.companyId).toEqual({
        in: [companyId],
      });
    });

    it('uses default offset/limit when not provided', async () => {
      prisma.bansheeOrder.count.mockResolvedValue(0);
      prisma.bansheeOrder.findMany.mockResolvedValue([]);

      await service.findAll(undefined, undefined as any, undefined as any, adminUser);

      const arg = prisma.bansheeOrder.findMany.mock.calls[0][0];
      expect(arg.skip).toBe(0);
      expect(arg.take).toBe(50);
    });
  });

  describe('BE-ORD-03: get order detail by id', () => {
    it('returns the order with its items/relations included', async () => {
      const order = { id: 'order-1', companyId, orderItems: [] };
      prisma.bansheeOrder.findUnique.mockResolvedValue(order);

      const result = await service.findOne('order-1', adminUser);

      expect(result).toBe(order);
      expect(prisma.bansheeOrder.findUnique.mock.calls[0][0].include).toBeDefined();
    });

    it('returns the order for a non-admin with matching company access', async () => {
      const order = { id: 'order-1', companyId, orderItems: [] };
      prisma.bansheeOrder.findUnique.mockResolvedValue(order);

      const result = await service.findOne('order-1', makeCompanyUser(companyId));

      expect(result).toBe(order);
    });

    it('throws when the order does not exist', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', adminUser)).rejects.toThrow(
        'Order with id missing not found',
      );
    });

    it('hides orders the (non-admin) user has no company access to', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId: 'other-company',
        orderItems: [],
      });

      await expect(
        service.findOne('order-1', makeCompanyUser(companyId)),
      ).rejects.toThrow('Order with id order-1 not found');
    });
  });

  describe('BE-ORD-04: cancel / complete order', () => {
    it('transitions a PENDING order to CANCELLED', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId,
        status: BansheeOrderStatus.PENDING,
        orderItems: [{ status: BansheeOrderItemStatus.PENDING }],
      });
      prisma.bansheeOrder.update.mockResolvedValue({
        id: 'order-1',
        status: BansheeOrderStatus.CANCELLED,
      });

      const result = await service.cancelOrder('order-1', undefined, adminUser);

      expect(result.status).toBe(BansheeOrderStatus.CANCELLED);
      expect(prisma.bansheeOrder.update.mock.calls[0][0].data.status).toBe(
        BansheeOrderStatus.CANCELLED,
      );
      // Pending items get cancelled too.
      expect(prisma.bansheeOrderItem.updateMany.mock.calls[0][0].data.status).toBe(
        BansheeOrderItemStatus.CANCELLED,
      );
    });

    it('rejects cancelling an already cancelled order', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId,
        status: BansheeOrderStatus.CANCELLED,
        orderItems: [],
      });

      await expect(
        service.cancelOrder('order-1', undefined, adminUser),
      ).rejects.toThrow('Order is already cancelled');
    });

    it('rejects cancelling a completed order', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId,
        status: BansheeOrderStatus.COMPLETED,
        orderItems: [],
      });

      await expect(
        service.cancelOrder('order-1', undefined, adminUser),
      ).rejects.toThrow('Cannot cancel a completed order');
    });

    it('rejects a non-admin cancelling an order from another company', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId: 'company-2',
        status: BansheeOrderStatus.PENDING,
        orderItems: [],
      });

      await expect(
        service.cancelOrder('order-1', companyId, makeCompanyUser(companyId)),
      ).rejects.toThrow('You can only cancel your own orders');
    });

    it('transitions a PENDING order to COMPLETED', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId,
        status: BansheeOrderStatus.PENDING,
        orderItems: [{ status: BansheeOrderItemStatus.PENDING }],
      });
      prisma.bansheeOrder.update.mockResolvedValue({
        id: 'order-1',
        status: BansheeOrderStatus.COMPLETED,
      });

      const result = await service.completeOrder('order-1', undefined, adminUser);

      expect(result.status).toBe(BansheeOrderStatus.COMPLETED);
      expect(prisma.bansheeOrder.update.mock.calls[0][0].data.status).toBe(
        BansheeOrderStatus.COMPLETED,
      );
    });

    it('rejects completing a cancelled order', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId,
        status: BansheeOrderStatus.CANCELLED,
        orderItems: [],
      });

      await expect(
        service.completeOrder('order-1', undefined, adminUser),
      ).rejects.toThrow('Cannot complete a cancelled order');
    });

    it('rejects a non-admin completing an order from another company', async () => {
      prisma.bansheeOrder.findUnique.mockResolvedValue({
        id: 'order-1',
        companyId: 'company-2',
        status: BansheeOrderStatus.PENDING,
        orderItems: [],
      });

      await expect(
        service.completeOrder('order-1', companyId, makeCompanyUser(companyId)),
      ).rejects.toThrow('You can only complete your own orders');
    });
  });

  describe('BE-ORD-05: fulfill / cancel order item and recompute order status', () => {
    it('fulfils a PENDING item and recomputes the order to PARTIALLY_COMPLETED', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.PENDING,
        order: { id: 'order-1' },
      });
      prisma.bansheeOrderItem.update.mockResolvedValue({
        id: 'item-1',
        status: BansheeOrderItemStatus.FULFILLED,
      });
      prisma.bansheeOrderItem.findMany.mockResolvedValue([
        { status: BansheeOrderItemStatus.FULFILLED },
        { status: BansheeOrderItemStatus.PENDING },
      ]);
      prisma.bansheeOrder.update.mockResolvedValue({});

      const result = await service.fulfillOrderItem('item-1');

      expect(result.status).toBe(BansheeOrderItemStatus.FULFILLED);
      expect(prisma.bansheeOrder.update.mock.calls[0][0]).toMatchObject({
        where: { id: 'order-1' },
        data: { status: BansheeOrderStatus.PARTIALLY_COMPLETED },
      });
    });

    it('recomputes to COMPLETED when remaining items are fulfilled or cancelled (no pending)', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.PENDING,
        order: { id: 'order-1' },
      });
      prisma.bansheeOrderItem.update.mockResolvedValue({
        id: 'item-1',
        status: BansheeOrderItemStatus.FULFILLED,
      });
      prisma.bansheeOrderItem.findMany.mockResolvedValue([
        { status: BansheeOrderItemStatus.FULFILLED },
        { status: BansheeOrderItemStatus.CANCELLED },
      ]);
      prisma.bansheeOrder.update.mockResolvedValue({});

      await service.fulfillOrderItem('item-1');

      expect(prisma.bansheeOrder.update.mock.calls[0][0].data.status).toBe(
        BansheeOrderStatus.COMPLETED,
      );
    });

    it('rejects fulfilling a non-PENDING item', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.FULFILLED,
        order: { id: 'order-1' },
      });

      await expect(service.fulfillOrderItem('item-1')).rejects.toThrow(
        'can only fulfill PENDING items',
      );
    });

    it('cancels a PENDING item and recomputes the order to CANCELLED when all are cancelled', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.PENDING,
        order: { id: 'order-1' },
      });
      prisma.bansheeOrderItem.update.mockResolvedValue({
        id: 'item-1',
        status: BansheeOrderItemStatus.CANCELLED,
      });
      prisma.bansheeOrderItem.findMany.mockResolvedValue([
        { status: BansheeOrderItemStatus.CANCELLED },
        { status: BansheeOrderItemStatus.CANCELLED },
      ]);
      prisma.bansheeOrder.update.mockResolvedValue({});

      const result = await service.cancelOrderItem('item-1');

      expect(result.status).toBe(BansheeOrderItemStatus.CANCELLED);
      expect(prisma.bansheeOrder.update.mock.calls[0][0].data.status).toBe(
        BansheeOrderStatus.CANCELLED,
      );
    });

    it('leaves the order status unchanged when items remain pending and none are fulfilled', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.PENDING,
        order: { id: 'order-1' },
      });
      prisma.bansheeOrderItem.update.mockResolvedValue({
        id: 'item-1',
        status: BansheeOrderItemStatus.CANCELLED,
      });
      prisma.bansheeOrderItem.findMany.mockResolvedValue([
        { status: BansheeOrderItemStatus.CANCELLED },
        { status: BansheeOrderItemStatus.PENDING },
      ]);

      await service.cancelOrderItem('item-1');

      expect(prisma.bansheeOrder.update).not.toHaveBeenCalled();
    });

    it('rejects cancelling a non-PENDING item', async () => {
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'item-1',
        orderId: 'order-1',
        status: BansheeOrderItemStatus.CANCELLED,
        order: { id: 'order-1' },
      });

      await expect(service.cancelOrderItem('item-1')).rejects.toThrow(
        'can only cancel PENDING items',
      );
    });
  });

  describe('fulfillOrderItemsForBansheeRequests (auto-fulfilment on measurement)', () => {
    it('does nothing for an empty entry list', async () => {
      await service.fulfillOrderItemsForBansheeRequests([]);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('fulfils the matching pending item and completes its order', async () => {
      prisma.bansheeOrderItem.findMany
        .mockResolvedValueOnce([
          {
            id: 'item-1',
            orderId: 'order-1',
            itemType: BansheeCartItemType.SERVICE_EXISTING,
            bansheeRequestId: 'req-1',
          },
        ]) // pending items for the requests
        .mockResolvedValueOnce([]); // no items still pending after fulfilment
      prisma.bansheeOrderItem.updateMany.mockResolvedValue({ count: 1 });
      prisma.bansheeOrder.updateMany.mockResolvedValue({ count: 1 });

      await service.fulfillOrderItemsForBansheeRequests([
        { bansheeRequestId: 'req-1', measurementId: 'm-1' },
      ]);

      expect(prisma.bansheeOrderItem.updateMany.mock.calls[0][0]).toMatchObject({
        where: { id: { in: ['item-1'] } },
        data: { status: BansheeOrderItemStatus.FULFILLED },
      });
      expect(prisma.bansheeOrder.updateMany.mock.calls[0][0].where.id.in).toContain(
        'order-1',
      );
      expect(prisma.bansheeOrder.updateMany.mock.calls[0][0].data.status).toBe(
        BansheeOrderStatus.COMPLETED,
      );
    });

    it('skips fulfilment when a request has more than one pending item (ambiguous)', async () => {
      prisma.bansheeOrderItem.findMany.mockResolvedValueOnce([
        {
          id: 'item-1',
          orderId: 'order-1',
          itemType: BansheeCartItemType.NEW_BANSHEE,
          bansheeRequestId: 'req-1',
        },
        {
          id: 'item-2',
          orderId: 'order-1',
          itemType: BansheeCartItemType.NEW_BANSHEE,
          bansheeRequestId: 'req-1',
        },
      ]);

      await service.fulfillOrderItemsForBansheeRequests([
        { bansheeRequestId: 'req-1' },
      ]);

      expect(prisma.bansheeOrderItem.updateMany).not.toHaveBeenCalled();
    });

    it('returns early when there are no pending items', async () => {
      prisma.bansheeOrderItem.findMany.mockResolvedValueOnce([]);

      await service.fulfillOrderItemsForBansheeRequests([
        { bansheeRequestId: 'req-1' },
      ]);

      expect(prisma.bansheeOrderItem.updateMany).not.toHaveBeenCalled();
      expect(prisma.bansheeOrder.updateMany).not.toHaveBeenCalled();
    });
  });
});
