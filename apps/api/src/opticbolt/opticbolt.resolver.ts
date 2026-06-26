import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateOpticboltTestResultInput } from './dto/create-opticbolt.input';
import { UpdateOpticboltTestResultInput } from './dto/update-opticbolt.input';
import { OpticboltService } from './opticbolt.service';
import * as GraphQLTypes from 'src/graphql-types';

@Resolver()
@UseGuards(JwtGuard)
export class OpticboltResolver {
  constructor(private readonly opticboltService: OpticboltService) {}

  @Query('opticboltTestResults')
  async findAll() {
    return this.opticboltService.findAll();
  } 

  @Query('opticboltTestResult')
  async findOne(@Args('id', ParseUUIDPipe) id: string) {
    return this.opticboltService.findOne(id);
  }

  @Mutation('createOpticboltTestResult')
  async create(
    @Args('createOpticboltTestResultInput')
    input: CreateOpticboltTestResultInput,
  ) {
    return this.opticboltService.create(input);
  }

  @Mutation('updateOpticboltTestResult')
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateOpticboltTestResultInput')
    input: UpdateOpticboltTestResultInput,
  ) {
    return this.opticboltService.update(id, input);
  }

  @Mutation('removeOpticboltTestResult')
  async remove(@Args('id', ParseUUIDPipe) id: string) {
    return this.opticboltService.remove(id);
  }
}
