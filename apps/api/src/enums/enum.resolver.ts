import { Resolver, Query } from '@nestjs/graphql';
import { Role, Result, BoltType, PullTestAbortReason } from '@prisma/client';
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
    };
  }
}
