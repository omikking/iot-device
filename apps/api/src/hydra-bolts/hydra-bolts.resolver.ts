import { Args, Resolver, Query, Int, Mutation } from '@nestjs/graphql';
import { HydraBoltsService } from './hydra-bolts.service';
import { Application } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ActiveUser } from 'src/auth/decorators';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { getAllowedCompanyIds } from 'src/utils';
import { CreateHydraBoltInput } from './dto/create-hydra-bolts.input';
import { UpdateHydraBoltInput } from './dto/update-hydra-bolts.input';
const OptionalUUID = new ParseUUIDPipe({ optional: true });

@Resolver('HydraBolt')
@UseGuards(JwtGuard, RolesGuard)
export class HydraBoltsResolver {
  constructor(private readonly hydraBoltsService: HydraBoltsService) {}

  @Roles([], [Application.HYDRA], 'hydraBolts')
  @Mutation('createHydraBolt')
  async create(
    @Args('createHydraBoltInput')
    createHydraBoltInput: CreateHydraBoltInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltsService.create(createHydraBoltInput, user);
  }

  @Roles([], [Application.HYDRA], 'hydraBolts')
  @Query('hydraBolt')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltsService.findOne(id, user, companyId);
  }

  // No @Roles here on purpose: RolesGuard authorizes against a single company
  @Query('hydraBolts')
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('serialNumber', { nullable: true }) serialNumber?: string,
    @Args('levelId', { nullable: true }, OptionalUUID) levelId?: string,
    @Args('driveId', { nullable: true }, OptionalUUID) driveId?: string,
    @Args('locationId', { nullable: true }, OptionalUUID) locationId?: string,
    @Args('createdBy', { nullable: true }, OptionalUUID) createdBy?: string,
    @Args('companyId', { nullable: true }, OptionalUUID) companyId?: string,
    @Args('siteId', { nullable: true }, OptionalUUID) siteId?: string,
    @Args('activateNotifications', { nullable: true })
    activateNotifications?: boolean,
  ) {
    const allowedCompanyIds = getAllowedCompanyIds(user);

    return this.hydraBoltsService.findAll(
      {
        offset,
        limit,
        serialNumber,
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

  @Roles([], [Application.HYDRA], 'hydraBolts')
  @Mutation('updateHydraBolt')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateHydraBoltInput')
    updateHydraBoltInput: UpdateHydraBoltInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltsService.update(id, updateHydraBoltInput, user);
  }

  @Roles([], [Application.HYDRA], 'hydraBolts')
  @Mutation('deleteHydraBolt')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltsService.remove(id, user, companyId);
  }

  @Roles([], [Application.HYDRA], 'hydraBolts')
  @Query('validateHydraBoltSerialNumber')
  async validate(
    @Args('companyId', ParseUUIDPipe) companyId: string,
    @Args('serialNumber') serialNumber: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.hydraBoltsService.validateSerialNumber(
      serialNumber,
      user,
      companyId,
    );
  }
}
