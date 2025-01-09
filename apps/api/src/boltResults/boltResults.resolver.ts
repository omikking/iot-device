import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { BoltResultsService } from './boltResults.service';

@Resolver()
export class BoltResultsResolver {
  constructor(private readonly boltResultsService: BoltResultsService) {}

  @Query('boltResults')
  async findAll(): Promise<GraphQLTypes.BoltResult[]> {
    return this.boltResultsService.findAll();
  }

  @Query('boltResult')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.findOne(id);
  }

  @Mutation('createBoltResult')
  async create(
    @Args('createBoltResultInput')
    createBoltResultInput: CreateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.create(createBoltResultInput);
  }

  @Mutation('updateBoltResult')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateBoltResultInput')
    updateBoltResultInput: UpdateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.update(id, updateBoltResultInput);
  }

  @Mutation('removeBoltResult')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.remove(id);
  }
}
