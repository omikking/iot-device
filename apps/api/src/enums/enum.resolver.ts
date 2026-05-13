import { Resolver, Query } from '@nestjs/graphql';
import {
  Role,
  Result,
  BoltType,
  RingPosition,
  PullTestAbortReason,
  Application,
  PlanLevel,
  ProceqStatus,
} from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  BOLT_TYPE_LABELS,
  PULL_TEST_ABORT_REASON_LABELS,
  RING_POSITION_LABELS,
} from './enum-labels.constants';
import * as GraphQLTypes from '../graphql-types';
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
  getBoltTypesOptions(): GraphQLTypes.EnumOption[] {
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
  getRingPositionOptions(): GraphQLTypes.EnumOption[] {
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
  getPullTestAbortReasonOptions(): GraphQLTypes.EnumOption[] {
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

  @Query(() => [ProceqStatus])
  getProceqStatus(): ProceqStatus[] {
    return Object.values(ProceqStatus);
  }
}
