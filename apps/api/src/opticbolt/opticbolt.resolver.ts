import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OpticboltService } from './opticbolt.service';
import { CreateOpticboltTestResultWithSpectrumsInput } from './dto/create-opticbolt.input';
import {
  UpdateOpticboltTestResultInput,
  UpdateOpticboltSpectrumInput,
} from './dto/update-opticbolt.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

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

  @UseGuards(JwtGuard)
  @Mutation('createOpticboltTestResultWithSpectrums')
  async createWithSpectrums(
    @Args('input')
    input: CreateOpticboltTestResultWithSpectrumsInput,
  ) {
    return this.opticboltService.createWithSpectrums(input);
  }

  @UseGuards(JwtGuard)
  @Mutation('updateOpticboltTestResult')
  async updateTestResult(
    @Args('serialNumber') serialNumber: string,
    @Args('input') input: UpdateOpticboltTestResultInput,
  ) {
    return this.opticboltService.updateWithSpectrums(serialNumber, input);
  }

  @UseGuards(JwtGuard)
  @Mutation('updateOpticboltSpectrum')
  async updateSpectrum(
    @Args('serialNumber') serialNumber: string,
    @Args('fbgIndex') fbgIndex: number,
    @Args('input') input: UpdateOpticboltSpectrumInput,
  ) {
    return this.opticboltService.updateSpectrumBySerialAndFbg(
      serialNumber,
      fbgIndex,
      input,
    );
  }
}
