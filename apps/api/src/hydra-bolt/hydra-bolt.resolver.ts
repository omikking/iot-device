import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HydraBoltService } from './hydra-bolt.service';
import { CreateHydraboltInput } from './dto/create-hydrabolt.input';

@Resolver()
export class HydraBoltResolver {
  constructor(private readonly hydraBoltService: HydraBoltService) {}

  @Mutation('createHydrabolt')
  async create(@Args('input') input: CreateHydraboltInput) {
    return this.hydraBoltService.create(input);
  }
}
