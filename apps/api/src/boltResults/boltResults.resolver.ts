import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoltResultsService } from './boltResults.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreateBoltResultInput } from './dto/create-boltResult.input';
import { UpdateBoltResultInput } from './dto/update-boltResult.input';

@Resolver()
export class BoltResultsResolver {
  constructor(private readonly boltResultsService: BoltResultsService) {}

  @Query('boltResults')
  async findAll(): Promise<GraphQLTypes.BoltResult[]> {
    return this.boltResultsService.findAll();
  }

  @Query('boltResult')
  async findOne(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.findOne(id);
  }

  @Mutation('createboltResult')
  async create(
    @Args('createBoltResultInput')
    createBoltResultInput: CreateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.create(createBoltResultInput);
  }

  @Mutation('updateboltResult')
  async update(
    @Args('id', ParseIntPipe) id: number,
    @Args('updateboltResultInput')
    updateBoltResultInput: UpdateBoltResultInput,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.update(id, updateBoltResultInput);
  }

  @Mutation('removeboltResult')
  async remove(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<GraphQLTypes.BoltResult> {
    return this.boltResultsService.remove(id);
  }
}
