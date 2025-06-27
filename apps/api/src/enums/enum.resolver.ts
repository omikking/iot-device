import { Resolver, Query } from '@nestjs/graphql';
import {
  Role,
  Result,
  BoltType,
  PullTestAbortReason,
  Application,
  PlanLevel,
  UserStatus,
} from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { getRingListPositionOptions } from './RingListPositions';

@Resolver('Enums')
@UseGuards(JwtGuard)
export class EnumResolver {
  @Query('enums')
  enums() {
    return {
      roles: Object.values(Role),
      results: Object.values(Result),
      boltTypes: Object.values(BoltType),
      ringPosition: getRingListPositionOptions(),
      pullTestAbortReason: Object.values(PullTestAbortReason),
      getApplication: Object.values(Application),
      getPlanLevel: Object.values(PlanLevel),
      getUserStatus: Object.values(UserStatus),
    };
  }
}
