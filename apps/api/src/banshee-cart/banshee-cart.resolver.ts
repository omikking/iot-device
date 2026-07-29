import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Application } from '@prisma/client';
import { BansheeCartService } from './banshee-cart.service';
import { AddCartItemInput } from './dto/add-cart-item.input';
import { UpdateNewBansheeCartItemInput } from './dto/update-new-banshee-cart-item.input';

@Resolver('BansheeCartItem')
@UseGuards(JwtGuard, RolesGuard)
export class BansheeCartResolver {
  constructor(private readonly bansheeCartService: BansheeCartService) {}

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Query('cartItems')
  async cartItems(@Args('companyId', ParseUUIDPipe) companyId: string) {
    return this.bansheeCartService.getCartItems(companyId);
  }

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Query('cartItemsStats')
  async cartItemsStats(@Args('companyId', ParseUUIDPipe) companyId: string) {
    return this.bansheeCartService.getCartItemsStats(companyId);
  }

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Mutation('addCartItems')
  async addCartItems(@Args('input') input: AddCartItemInput[]) {
    return this.bansheeCartService.addCartItems(input);
  }

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Mutation('updateNewBansheeCartItem')
  async updateNewBansheeCartItem(
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @Args('cartItemId', ParseUUIDPipe) cartItemId: string,
    @Args('input') input: UpdateNewBansheeCartItemInput,
  ) {
    return this.bansheeCartService.updateNewBansheeCartItem(
      companyId,
      cartItemId,
      input,
    );
  }

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Mutation('deleteCartItem')
  async deleteCartItem(@Args('id', ParseUUIDPipe) id: string) {
    return this.bansheeCartService.deleteCartItem(id);
  }

  @Roles([], [Application.BANSHEE], 'bansheeCartItem')
  @Mutation('clearCart')
  async clearCart(@Args('companyId', ParseUUIDPipe) companyId: string) {
    return this.bansheeCartService.clearCart(companyId);
  }
}
