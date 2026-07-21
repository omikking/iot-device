import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HydraBoltService } from './hydra-bolt.service';
import { CreateHydraboltInput } from './dto/create-hydrabolt.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Resolver()
export class HydraBoltResolver {
  constructor(private readonly hydraBoltService: HydraBoltService) {}

  @Query('hydrabolts')
  async findAll(@Args('since', { nullable: true }) since?: string) {
    return this.hydraBoltService.findAll(since ? new Date(since) : undefined);
  }

  @Query('hydraboltByPartNumber')
  async findByPartNumber(@Args('partNumber') partNumber: string) {
    return this.hydraBoltService.findByPartNumber(partNumber);
  }

  @UseGuards(JwtGuard)
  @Mutation('createHydrabolt')
  async create(@Args('input') input: CreateHydraboltInput) {
    return this.hydraBoltService.create(input);
  }
}
