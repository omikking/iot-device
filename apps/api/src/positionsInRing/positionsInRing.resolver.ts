import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PositionsInRingService } from './positionsInRing.service';
import * as GraphQLTypes from 'src/graphql-types';
import { CreatePositionInRingInput } from './dto/create-positionInRing.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdatePositionInRingInput } from './dto/update-positionInRing.input';

@Resolver()
export class PositionsInRingResolver {
  constructor(
    private readonly positionsInRingService: PositionsInRingService,
  ) {}

  @Query('positionsInRing')
  async findAll(): Promise<GraphQLTypes.PositionInRing[]> {
    return this.positionsInRingService.findAll();
  }

  @Query('positionInRing')
  async findOne(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.PositionInRing> {
    return this.positionsInRingService.findOne(id);
  }

  @Mutation('createPositionInRing')
  async create(
    @Args('createPositionInRingInput')
    createPositionInRingInput: CreatePositionInRingInput,
  ): Promise<GraphQLTypes.PositionInRing> {
    return this.positionsInRingService.create(createPositionInRingInput);
  }

  @Mutation('updatePositionInRing')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updatePositionInRingInput')
    updatePositionInRingInput: UpdatePositionInRingInput,
  ): Promise<GraphQLTypes.PositionInRing> {
    return this.positionsInRingService.update(id, updatePositionInRingInput);
  }

  @Mutation('removePositionInRing')
  async remove(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<GraphQLTypes.PositionInRing> {
    return this.positionsInRingService.remove(id);
  }
}
