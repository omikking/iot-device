import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DrivesService } from './drives.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateDriveInput } from './dto/create-drive.input';
import { UpdateDriveInput } from './dto/update-drive.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver()
@UseGuards(JwtGuard, RolesGuard)
export class DrivesResolver {
  constructor(private readonly drivesService: DrivesService) {}

  // Fix here
  @Query('drives')
  async findAll(): Promise<GraphQLTypes.Drive[]> {
    return this.drivesService.findAll();
  }

  @Roles([], [], 'drive')
  @Query('drive')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.findOne(id);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'drive')
  @Mutation('createDrive')
  async create(
    @Args('createDriveInput')
    createDriveInput: CreateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.create(createDriveInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'drive')
  @Mutation('updateDrive')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateDriveInput')
    updateDriveInput: UpdateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.update(id, updateDriveInput);
  }

  @Roles([Role.COMPANY_ADMIN], [], 'drive')
  @Mutation('removeDrive')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.remove(id);
  }
}
