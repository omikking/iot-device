import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BansheeTemplateService } from './banshee-template.service';
import { Application } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { BansheeTemplateInputDto } from './dto/banshee-template.input';

@Resolver('BansheeTemplate')
@UseGuards(JwtGuard, RolesGuard)
export class BansheeTemplateResolver {
  constructor(
    private readonly bansheeTemplateService: BansheeTemplateService,
  ) {}

  @Roles([], [Application.BANSHEE], 'template')
  @Mutation('createBansheeTemplate')
  async createBansheeTemplate(
    @Args('createBansheeTemplateInput')
    createBansheeTemplateInput: BansheeTemplateInputDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeTemplateService.createBansheeTemplate(
      createBansheeTemplateInput,
      user,
    );
  }

  @Roles([], [Application.BANSHEE], 'template')
  @Mutation('updateBansheeTemplate')
  async updateBansheeTemplate(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateBansheeTemplateInput')
    updateBansheeTemplateInput: BansheeTemplateInputDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeTemplateService.updateBansheeTemplate(
      id,
      updateBansheeTemplateInput,
      user,
    );
  }

  @Roles([], [Application.BANSHEE], 'template')
  @Mutation('deleteBansheeTemplate')
  async deleteBansheeTemplate(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeTemplateService.deleteBansheeTemplate(id, user);
  }

  @Roles([], [Application.BANSHEE], 'template')
  @Query('getBansheeTemplateById')
  async getBansheeTemplateById(
    @Args('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeTemplateService.findBansheeTemplateById(id, user);
  }

  @Query('getBansheeTemplates')
  async getBansheeTemplates(
    @Args('companyId') companyId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bansheeTemplateService.findBansheeTemplates(companyId, user);
  }
}
