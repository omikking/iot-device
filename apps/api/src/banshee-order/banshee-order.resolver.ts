import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { Application, GlobalRole } from '@prisma/client';
import { BansheeOrderService } from './banshee-order.service';
import { SubmitOrderInput } from './dto/submit-order.input';
import { OrderFilterInput } from './dto/order-filter.input';
import { getAllowedCompanyIds } from 'src/utils/resolveAllowedCompanyIds';

@Resolver('BansheeOrder')
@UseGuards(JwtGuard, RolesGuard)
export class BansheeOrderResolver {
  constructor(private readonly bansheeOrderService: BansheeOrderService) {}

  @Roles([], [Application.BANSHEE], 'bansheeOrder')
  @Query('orders')
  async orders(
    @ActiveUser() user: ActiveUserData,
    @Args('filter') filter?: OrderFilterInput,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.bansheeOrderService.findAll(filter, offset, limit, user);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrder')
  @Query('order')
  async order(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeOrderService.findOne(id, user);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrder')
  @Mutation('submitOrder')
  async submitOrder(@Args('input') input: SubmitOrderInput) {
    return this.bansheeOrderService.submitOrder(input);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrder')
  @Mutation('cancelOrder')
  async cancelOrder(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    let companyId;
    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      companyId = this.resolveCompanyId(user);
    }
    return this.bansheeOrderService.cancelOrder(id, companyId, user);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrder')
  @Mutation('completeOrder')
  async completeOrder(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    let companyId;
    if (user.globalRole !== GlobalRole.SANDVIK_ADMIN) {
      companyId = this.resolveCompanyId(user);
    }
    return this.bansheeOrderService.completeOrder(id, companyId, user);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrderItem')
  @Mutation('fulfillOrderItem')
  async fulfillOrderItem(@Args('id', ParseUUIDPipe) id: string) {
    return this.bansheeOrderService.fulfillOrderItem(id);
  }

  @Roles([], [Application.BANSHEE], 'bansheeOrderItem')
  @Mutation('cancelOrderItem')
  async cancelOrderItem(@Args('id', ParseUUIDPipe) id: string) {
    return this.bansheeOrderService.cancelOrderItem(id);
  }

  private resolveCompanyId(user: ActiveUserData): string {
    const companyIds = getAllowedCompanyIds(user);
    if (companyIds.length === 0) {
      throw new Error('User is not associated with any company');
    }
    return companyIds[0];
  }
}
