import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OpticboltService } from './opticbolt.service';
import { CreateOpticboltTestResultWithSpectrumsInput } from './dto/create-opticbolt.input';

@Resolver()
// @UseGuards(JwtGuard)
export class OpticboltResolver {
  constructor(private readonly opticboltService: OpticboltService) {}

  @Query('opticboltTestResults')
  async findAll(@Args('since', { nullable: true }) since?: string) {
    return this.opticboltService.findAll(since ? new Date(since) : undefined);
  }

  @Query('opticboltSpectrumsBySerialNumber')
  async findSpectrumsBySerialNumber(
    @Args('serialNumber') serialNumber: string,
  ) {
    return this.opticboltService.findSpectrumsBySerialNumber(serialNumber);
  }

  @Mutation('createOpticboltTestResultWithSpectrums')
  async createWithSpectrums(
    @Args('input')
    input: CreateOpticboltTestResultWithSpectrumsInput,
  ) {
    return this.opticboltService.createWithSpectrums(input);
  }
}
