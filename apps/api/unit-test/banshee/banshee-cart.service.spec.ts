import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeCartService } from 'src/banshee-cart/banshee-cart.service';
import { BansheeCartItemType } from '@prisma/client';
import { PrismaMock, createPrismaMock } from '../test-utils';

/**
 * Banshee Cart API — unit tests.
 *
 * Covers smoke cases BE-CRT-01 .. BE-CRT-05 plus extended branch coverage of
 * every BansheeCartService method.
 */
describe('BansheeCartService', () => {
  let prisma: PrismaMock;
  let service: BansheeCartService;

  const companyId = 'company-1';

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new BansheeCartService(prisma as unknown as PrismaService);
  });

  describe('BE-CRT-01: add cart items — mixed types', () => {
    it('adds NEW_BANSHEE and SERVICE_EXISTING items and reports nothing skipped', async () => {
      const input = [
        {
          itemType: BansheeCartItemType.NEW_BANSHEE,
          companyId,
          name: 'New banshee',
          quantity: 2,
        },
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          companyId,
          bansheeRequestId: 'req-1',
        },
      ];

      prisma.bansheeRequest.findMany.mockResolvedValue([{ id: 'req-1' }]);
      prisma.bansheeCartItem.findMany.mockResolvedValue([]); // none already in cart
      prisma.bansheeCartItem.create.mockResolvedValue({ id: 'cart-x' });

      const result = await service.addCartItems(input as any);

      expect(result.added).toHaveLength(2);
      expect(result.skipped).toEqual([]);
      expect(prisma.bansheeCartItem.create).toHaveBeenCalledTimes(2);
    });

    it('skips a SERVICE_EXISTING item already in the company cart, with a reason', async () => {
      const input = [
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          companyId,
          bansheeRequestId: 'req-1',
        },
      ];

      prisma.bansheeRequest.findMany.mockResolvedValue([{ id: 'req-1' }]);
      prisma.bansheeCartItem.findMany.mockResolvedValue([
        {
          companyId,
          bansheeRequestId: 'req-1',
          bansheeRequest: { serialNumber: 'SN-1001' },
        },
      ]);

      const result = await service.addCartItems(input as any);

      expect(result.added).toEqual([]);
      expect(result.skipped).toEqual([
        {
          bansheeRequestId: 'req-1',
          serialNumber: 'SN-1001',
          reason: 'Already in cart for this company',
        },
      ]);
      expect(prisma.bansheeCartItem.create).not.toHaveBeenCalled();
    });

    it('rejects a SERVICE_EXISTING item without a bansheeRequestId', async () => {
      const input = [
        { itemType: BansheeCartItemType.SERVICE_EXISTING, companyId },
      ];

      await expect(service.addCartItems(input as any)).rejects.toThrow(
        'bansheeRequestId is required for SERVICE_EXISTING items',
      );
    });

    it('rejects when a referenced bansheeRequest does not exist', async () => {
      const input = [
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          companyId,
          bansheeRequestId: 'ghost',
        },
      ];
      prisma.bansheeRequest.findMany.mockResolvedValue([]); // none found

      await expect(service.addCartItems(input as any)).rejects.toThrow(
        'BansheeRequest with id ghost does not exist',
      );
      expect(prisma.bansheeCartItem.create).not.toHaveBeenCalled();
    });

    it('returns empty result for empty input without creating anything', async () => {
      const result = await service.addCartItems([]);

      expect(result).toEqual({ added: [], skipped: [] });
      expect(prisma.bansheeCartItem.create).not.toHaveBeenCalled();
    });
  });

  describe('BE-CRT-02: list cart items by company', () => {
    it('returns the items for the requested company with relations included', async () => {
      const items = [{ id: 'cart-1' }, { id: 'cart-2' }];
      prisma.bansheeCartItem.findMany.mockResolvedValue(items);

      const result = await service.getCartItems(companyId);

      expect(result).toBe(items);
      const arg = prisma.bansheeCartItem.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({ companyId });
      expect(arg.include).toMatchObject({
        company: true,
        site: true,
        level: true,
        drive: true,
        location: true,
      });
      expect(arg.orderBy).toEqual({ createdAt: 'desc' });
    });
  });

  describe('BE-CRT-03: update new banshee cart item', () => {
    it('updates the supplied fields of a NEW_BANSHEE cart item', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue({
        id: 'cart-1',
        companyId,
        itemType: BansheeCartItemType.NEW_BANSHEE,
      });
      const updated = { id: 'cart-1', quantity: 5, name: 'Renamed' };
      prisma.bansheeCartItem.update.mockResolvedValue(updated);

      const result = await service.updateNewBansheeCartItem(
        companyId,
        'cart-1',
        {
          quantity: 5,
          name: 'Renamed',
          period: 12,
        } as any,
      );

      expect(result).toBe(updated);
      const arg = prisma.bansheeCartItem.update.mock.calls[0][0];
      expect(arg.where).toEqual({ id: 'cart-1' });
      expect(arg.data).toMatchObject({
        quantity: 5,
        name: 'Renamed',
        period: 12,
      });
    });

    it('only writes the fields that were provided', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue({
        id: 'cart-1',
        companyId,
        itemType: BansheeCartItemType.NEW_BANSHEE,
      });
      prisma.bansheeCartItem.update.mockResolvedValue({ id: 'cart-1' });

      await service.updateNewBansheeCartItem(companyId, 'cart-1', {
        name: 'Only name',
      } as any);

      const data = prisma.bansheeCartItem.update.mock.calls[0][0].data;
      expect(data).toEqual({ name: 'Only name' });
      expect('quantity' in data).toBe(false);
    });

    it('rejects when the cart item does not exist', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue(null);

      await expect(
        service.updateNewBansheeCartItem(companyId, 'missing', {} as any),
      ).rejects.toThrow('CartItem with id missing not found');
    });

    it('rejects when the cart item belongs to another company', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue({
        id: 'cart-1',
        companyId: 'other-company',
        itemType: BansheeCartItemType.NEW_BANSHEE,
      });

      await expect(
        service.updateNewBansheeCartItem(companyId, 'cart-1', {} as any),
      ).rejects.toThrow('does not belong to company');
    });

    it('rejects when the cart item is not a NEW_BANSHEE item', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue({
        id: 'cart-1',
        companyId,
        itemType: BansheeCartItemType.SERVICE_EXISTING,
      });

      await expect(
        service.updateNewBansheeCartItem(companyId, 'cart-1', {} as any),
      ).rejects.toThrow('is not a NEW_BANSHEE item');
    });
  });

  describe('BE-CRT-04: delete cart item & clear cart', () => {
    it('deletes only the targeted cart item', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue({ id: 'cart-1' });
      const deleted = { id: 'cart-1' };
      prisma.bansheeCartItem.delete.mockResolvedValue(deleted);

      const result = await service.deleteCartItem('cart-1');

      expect(result).toBe(deleted);
      expect(prisma.bansheeCartItem.delete.mock.calls[0][0].where).toEqual({
        id: 'cart-1',
      });
    });

    it('rejects deleting a non-existent cart item', async () => {
      prisma.bansheeCartItem.findUnique.mockResolvedValue(null);

      await expect(service.deleteCartItem('missing')).rejects.toThrow(
        'CartItem with id missing not found',
      );
    });

    it('clears every cart item for a company and returns true', async () => {
      prisma.bansheeCartItem.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clearCart(companyId);

      expect(result).toBe(true);
      expect(prisma.bansheeCartItem.deleteMany).toHaveBeenCalledWith({
        where: { companyId },
      });
    });
  });

  describe('BE-CRT-05: cart stats aggregation', () => {
    it('returns newBanshee, serviceExisting and total summed from quantities', async () => {
      prisma.bansheeCartItem.groupBy.mockResolvedValue([
        { itemType: BansheeCartItemType.NEW_BANSHEE, _sum: { quantity: 3 } },
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          _sum: { quantity: 2 },
        },
      ]);

      const result = await service.getCartItemsStats(companyId);

      expect(result).toEqual({ newBanshee: 3, serviceExisting: 2, total: 5 });
    });

    it('handles a single present type and a null _sum', async () => {
      prisma.bansheeCartItem.groupBy.mockResolvedValue([
        { itemType: BansheeCartItemType.NEW_BANSHEE, _sum: { quantity: null } },
      ]);

      const result = await service.getCartItemsStats(companyId);

      expect(result).toEqual({ newBanshee: 0, serviceExisting: 0, total: 0 });
    });

    it('defaults missing groups to zero', async () => {
      prisma.bansheeCartItem.groupBy.mockResolvedValue([]);

      const result = await service.getCartItemsStats(companyId);

      expect(result).toEqual({ newBanshee: 0, serviceExisting: 0, total: 0 });
    });
  });
});
