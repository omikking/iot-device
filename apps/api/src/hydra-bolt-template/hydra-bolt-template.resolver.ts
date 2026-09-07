import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Application } from '@prisma/client';
import { ActiveUser } from 'src/auth/decorators';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { getAllowedCompanyIds } from 'src/utils';
import { HydraBoltTemplateService } from './hydra-bolt-template.service';
import { CreateHydraBoltTemplateInputDto } from './dto/create-hydra-bolt-template.input';
import { UpdateHydraBoltTemplateInputDto } from './dto/update-hydra-bolt-template.input';

@Resolver('HydraBoltTemplate')
@UseGuards(JwtGuard, RolesGuard)
export class HydraBoltTemplateResolver {
  constructor(
    private readonly hydraBoltTemplateService: HydraBoltTemplateService,
  ) {}

  @Roles([], [Application.HYDRA], 'hydraBoltTemplate')
  @Mutation('createHydraBoltTemplate')
  async create(
    @Args('createHydraBoltTemplateInput')
    createHydraBoltTemplateInput: CreateHydraBoltTemplateInputDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltTemplateService.create(
      createHydraBoltTemplateInput,
      user,
    );
  }

  @Roles([], [Application.HYDRA], 'hydraBoltTemplate')
  @Query('hydraBoltTemplate')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltTemplateService.findOne(id, companyId, user);
  }

  @Roles([], [Application.HYDRA], 'hydraBoltTemplate')
  @Query('hydraBoltTemplates')
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('levelId', { nullable: true }) levelId?: string,
    @Args('driveId', { nullable: true }) driveId?: string,
    @Args('locationId', { nullable: true }) locationId?: string,
    @Args('createdBy', { nullable: true }) createdBy?: string,
    @Args('companyId', { nullable: true }) companyId?: string,
    @Args('siteId', { nullable: true }) siteId?: string,
    @Args('activateNotifications', { nullable: true })
    activateNotifications?: boolean,
  ) {
    const allowedCompanyIds = getAllowedCompanyIds(user);

    return this.hydraBoltTemplateService.findAll(
      {
        offset,
        limit,
        levelId,
        driveId,
        locationId,
        createdBy,
        companyId,
        siteId,
        activateNotifications,
      },
      allowedCompanyIds,
      user,
    );
  }

  @Roles([], [Application.HYDRA], 'hydraBoltTemplate')
  @Mutation('updateHydraBoltTemplate')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateHydraBoltTemplateInput')
    updateHydraBoltTemplateInput: UpdateHydraBoltTemplateInputDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltTemplateService.update(
      id,
      updateHydraBoltTemplateInput,
      user,
    );
  }

  @Roles([], [Application.HYDRA], 'hydraBoltTemplate')
  @Mutation('deleteHydraBoltTemplate')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltTemplateService.remove(id, user, companyId);
  }
}
