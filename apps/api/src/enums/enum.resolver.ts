import { Resolver, Query } from '@nestjs/graphql';
import {
  Role,
  Result,
  BoltType,
  RingPosition,
  PullTestAbortReason,
  Application,
  PlanLevel,
} from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  BOLT_TYPE_LABELS,
  PULL_TEST_ABORT_REASON_LABELS,
  RING_POSITION_LABELS,
} from './enum-labels.constants';

interface EnumOption {
  value: string;
  label: string;
}

@Resolver()
@UseGuards(JwtGuard)
export class EnumResolver {
  @Query()
  getRoles(): Role[] {
    return Object.values(Role);
  }

  @Query()
  getResults(): Result[] {
    return Object.values(Result);
  }

  @Query()
  getBoltTypes(): BoltType[] {
    return Object.values(BoltType);
  }

  @Query()
  getBoltTypesOptions(): EnumOption[] {
    return Object.values(BoltType).map((value) => ({
      value,
      label: BOLT_TYPE_LABELS[value],
    }));
  }

  @Query()
  getRingPosition(): RingPosition[] {
    return Object.values(RingPosition);
  }

  @Query()
  getRingPositionOptions(): EnumOption[] {
    return Object.values(RingPosition).map((value) => ({
      value,
      label: RING_POSITION_LABELS[value],
    }));
  }

  @Query()
  getPullTestAbortReason(): PullTestAbortReason[] {
    return Object.values(PullTestAbortReason);
  }

  @Query()
  getPullTestAbortReasonOptions(): EnumOption[] {
    return Object.values(PullTestAbortReason).map((value) => ({
      value,
      label: PULL_TEST_ABORT_REASON_LABELS[value],
    }));
  }

  @Query()
  getApplication(): Application[] {
    return Object.values(Application);
  }

  @Query()
  getPlanLevel(): PlanLevel[] {
    return Object.values(PlanLevel);
  }
}
