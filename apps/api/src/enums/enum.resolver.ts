import { Resolver, Query } from '@nestjs/graphql';
import {
  Role,
  Result,
  BoltType,
  RingPosition,
  PullTestAbortReason,
} from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EnumOption, getRingListPositionOptions } from './RingListPositions';

@Resolver()
@UseGuards(JwtGuard)
export class EnumResolver {
  @Query(() => [Role])
  getRoles(): Role[] {
    return Object.values(Role);
  }

  @Query(() => [Result])
  getResults(): Result[] {
    return Object.values(Result);
  }

  @Query(() => [BoltType])
  getBoltTypes(): BoltType[] {
    return Object.values(BoltType);
  }
  @Query(() => [RingPosition])
  getRingPosition(): RingPosition[] {
    return Object.values(RingPosition);
  }

  @Query(() => [PullTestAbortReason])
  getPullTestAbortReason(): PullTestAbortReason[] {
    return Object.values(PullTestAbortReason);
  }
  @Query(() => [EnumOption])
  getRingListPositions(): EnumOption[] {
    return getRingListPositionOptions();
  }
}
