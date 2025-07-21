import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DrivesService } from './drives.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateDriveInput } from './dto/create-drive.input';
import { UpdateDriveInput } from './dto/update-drive.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { CompanyContextGuard } from 'src/auth/guard/company-context.guard';
import { RequireCompanyAccess } from 'src/auth/decorators/permission.decorator';
import { CompaniesAccessGuard } from 'src/auth/guard/companies-access.guard';

@Resolver()
@UseGuards(JwtGuard, CompanyContextGuard, PermissionGuard)
export class DrivesResolver {
  constructor(private readonly drivesService: DrivesService) {}

  // TODO what restrictions do we want here?
  // Should any role be able to create, update, delete or just company admins?
  @UseGuards(CompaniesAccessGuard)
  @Query('drives')
  async findAll(@Context() context: any): Promise<GraphQLTypes.Drive[]> {
    return this.drivesService.findAll(
      context.allowedCompanyIds,
      context.isSandvikAdmin,
    );
  }

  @RequireCompanyAccess(true)
  @Query('drive')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.findOne(id);
  }

  @RequireCompanyAccess(true)
  @Mutation('createDrive')
  async create(
    @Args('createDriveInput')
    createDriveInput: CreateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.create(createDriveInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('updateDrive')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateDriveInput')
    updateDriveInput: UpdateDriveInput,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.update(id, updateDriveInput);
  }

  @RequireCompanyAccess(true)
  @Mutation('removeDrive')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.Drive> {
    return this.drivesService.remove(id);
  }
}
