import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DrivesService } from './drives.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateDriveInput } from './dto/create-drive.input';
import { UpdateDriveInput } from './dto/update-drive.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class DrivesResolver {
  constructor(private readonly drivesService: DrivesService) {}

  @Query('drives')
  async findAll(): Promise<GraphQLTypes.Drive[]> {
    return this.drivesService.findAll();
  }

  @Query('drive')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.findOne(id);
  }

  @Mutation('createDrive')
  async create(
    @Args('createDriveInput')
    createDriveInput: CreateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.create(createDriveInput);
  }

  @Mutation('updateDrive')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateDriveInput')
    updateDriveInput: UpdateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.update(id, updateDriveInput);
  }

  @Mutation('removeDrive')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.remove(id);
  }
}
