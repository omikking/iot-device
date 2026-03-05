import { responses } from '@/app/uitexts/responses';
import {
  Application,
  BoltResult,
  BoltType,
  PullTestAbortReason,
  RingPosition,
} from '@/gql/graphql';
import { showAlertToast } from '@gsp/ui';
import { CombinedError } from 'urql';

// Function to get application name based on enum
export const getAppName = (app: Application): string => {
  const applicationNames = {
    [Application.PullTest]: 'Pull Test',
    [Application.PullTestTechnician]: 'Pull Test Technician',
    // [Application.Banshee]: 'Banshee',
  };
  return applicationNames[app];
};

// Function to capitalize the first letter of a string
export const capitalizeFirstLetter = (
  text: string | null | undefined,
): string => {
  if (!text) return 'N/A';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Function to generate bolt specifications
export const generateBoltSpecifications = (
  boltData: BoltResult,
  names: {
    levelName?: string;
    driveName?: string;
    locationName?: string;
  },
) => {
  return [
    {
      title: 'Measured at',
      text: new Date(Number(boltData.measuredAt)).toLocaleString() || 'N/A',
    },
    {
      title: 'Bolt number',
      text: boltData.boltNumber?.toString() || 'N/A',
    },
    {
      title: 'Bolt type',
      text: convertBoltType(boltData.boltType as BoltType) || 'N/A',
    },
    {
      title: 'Level',
      text: names.levelName || 'N/A',
    },
    {
      title: 'Drive',
      text: names.driveName || 'N/A',
    },
    {
      title: 'Location',
      text: names.locationName || 'N/A',
    },
    {
      title: 'Position in ring',
      text:
        convertRingPosition(boltData.positionInRing as RingPosition) || 'N/A',
    },
    {
      title: 'Result',
      text: capitalizeFirstLetter(boltData.result) || 'N/A',
    },
    ...(boltData.abortReason
      ? [
          {
            title: 'Abort Reason',
            text: convertAbortReason(
              boltData.abortReason as PullTestAbortReason,
            ),
          },
        ]
      : []),
  ];
};

// Function to handle GraphQL errors
interface NestJsValidationError {
  message: string | string[];
  statusCode?: number;
  error?: string;
  [key: string]: unknown;
}

export interface GraphQLErrorExtensions {
  code?: string;
  title: string;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  originalError?: NestJsValidationError;
}

export const handleGraphQLErrors = (error: CombinedError | undefined) => {
  if (!error?.graphQLErrors?.length) {
    return false;
  }

  const graphQLError = error.graphQLErrors[0];
  const extensions =
    graphQLError.extensions as unknown as GraphQLErrorExtensions;

  if (extensions?.code === 'FORBIDDEN') {
    showAlertToast({
      title: responses.accessDeniedError_title,
      description: responses.accessDeniedError_message,
      variant: 'error',
    });
    return true;
  }

  // Validation custom errors from backend
  if (
    extensions?.code === 'BAD_REQUEST' &&
    extensions?.originalError?.message
  ) {
    const validationErrors = extensions.originalError.message;
    const errorMessage = Array.isArray(validationErrors)
      ? validationErrors.join(', ')
      : validationErrors;

    showAlertToast({
      title: 'Validation Error',
      description: errorMessage,
      variant: 'error',
    });
    return true;
  }

  // Custom GraphQL errors
  if (extensions) {
    showAlertToast({
      title: extensions.title,
      description: extensions.message,
      variant: extensions.type || 'error',
    });
    return true;
  }
};

export const convertRingPosition = (position: RingPosition): string => {
  const ringPositionDisplayMap: Record<RingPosition, string> = {
    [RingPosition.RhBacks]: 'R/H Backs',
    [RingPosition.RhShoulder]: 'R/H Shoulder',
    [RingPosition.RhWallUpper]: 'R/H Wall Upper',
    [RingPosition.RhWallCenter]: 'R/H Wall Center',
    [RingPosition.RhWallLower]: 'R/H Wall Lower',
    [RingPosition.RhFaceHigh]: 'R/H Face High',
    [RingPosition.RhFaceLow]: 'R/H Face Low',
    [RingPosition.LhBacks]: 'L/H Backs',
    [RingPosition.LhShoulder]: 'L/H Shoulder',
    [RingPosition.LhWallUpper]: 'L/H Wall Upper',
    [RingPosition.LhWallCenter]: 'L/H Wall Center',
    [RingPosition.LhWallLower]: 'L/H Wall Lower',
    [RingPosition.LhFaceHigh]: 'L/H Face High',
    [RingPosition.LhFaceLow]: 'L/H Face Low',
    [RingPosition.CenterBacks]: 'Center Backs',
  };

  if (position in ringPositionDisplayMap) {
    return ringPositionDisplayMap[position as RingPosition];
  }
  return position.toString();
};

export const convertBoltType = (boltType: BoltType): string => {
  const boltTypeDisplayMap: Record<BoltType, string> = {
    [BoltType.D47Md_1_8M]: 'D47 MD - 1.8 m',
    [BoltType.D47Md_2_1M]: 'D47 MD - 2.1 m',
    [BoltType.D47Md_2_4M]: 'D47 MD - 2.4 m',
    [BoltType.D47Md_3_0M]: 'D47 MD - 3.0 m',
    [BoltType.D47Md_3_8M]: 'D47 MD - 3.8 m',
    [BoltType.D47Mdx_1_8M]: 'D47 MDX - 1.8 m',
    [BoltType.D47Mdx_2_1M]: 'D47 MDX - 2.1 m',
    [BoltType.D47Mdx_2_4M]: 'D47 MDX - 2.4 m',
    [BoltType.D47Mdx_3_0M]: 'D47 MDX - 3.0 m',
    [BoltType.D47Mdx_3_8M]: 'D47 MDX - 3.8 m',
    [BoltType.D47Mdx_4_0M]: 'D47 MDX - 4.0 m',
    [BoltType.D39Mdx_1_8M]: 'D39 MDX - 1.8 m',
    [BoltType.D39Mdx_2_1M]: 'D39 MDX - 2.1 m',
    [BoltType.D39Mdx_2_4M]: 'D39 MDX - 2.4 m',
    [BoltType.D39Mdx_3_0M]: 'D39 MDX - 3.0 m',
    [BoltType.D47MdxPegBolt_1_8M]: 'D47 MDX - Peg Bolt - 1.8 m',
    [BoltType.D47MdxPegBolt_2_1M]: 'D47 MDX - Peg Bolt - 2.1 m',
    [BoltType.D47MdxPegBolt_2_4M]: 'D47 MDX - Peg Bolt - 2.4 m',
    [BoltType.D47MdxPegBolt_3_0M]: 'D47 MDX - Peg Bolt - 3.0 m',
    [BoltType.D39MdxPegBolt_1_8M]: 'D39 MDX - Peg Bolt - 1.8 m',
    [BoltType.D39MdxPegBolt_2_1M]: 'D39 MDX - Peg Bolt - 2.1 m',
    [BoltType.D39MdxPegBolt_2_4M]: 'D39 MDX - Peg Bolt - 2.4 m',
    [BoltType.D39MdxPegBolt_3_0M]: 'D39 MDX - Peg Bolt - 3.0 m',
    [BoltType.D47MdPegBolt_1_8M]: 'D47 MD - Peg Bolt - 1.8 m',
    [BoltType.D47MdPegBolt_2_1M]: 'D47 MD - Peg Bolt - 2.1 m',
    [BoltType.D47MdPegBolt_2_4M]: 'D47 MD - Peg Bolt - 2.4 m',
    [BoltType.D47MdPegBolt_3_0M]: 'D47 MD - Peg Bolt - 3.0 m',
    [BoltType.FrictionBolt_47Mm]: 'Friction Bolt Ø47 mm',
    [BoltType.FrictionBolt_39Mm]: 'Friction Bolt Ø39 mm',
    [BoltType.FrictionBolt_33Mm]: 'Friction Bolt Ø33 mm',
    [BoltType.SpiralFrictionBolt]: 'Spiral Friction Bolt',
    [BoltType.KinlocBolt]: 'Kinloc Bolt',
    [BoltType.KinlocBoltIndie]: 'Kinloc Bolt Indie',
  };

  if (boltType in boltTypeDisplayMap) {
    return boltTypeDisplayMap[boltType as BoltType];
  }
  return boltType.toString();
};

export const convertAbortReason = (reason: PullTestAbortReason): string => {
  const abortReasonDisplayMap: Record<PullTestAbortReason, string> = {
    [PullTestAbortReason.NotTestedVoidCavity]:
      'Bolt not tested due to void or cavity',
    [PullTestAbortReason.TestStoppedInstallAngle]:
      'Test stopped due to incorrect installation angle',
    [PullTestAbortReason.PegNotExtruded]:
      'Bolt has not been installed correctly, peg not extruded',
    [PullTestAbortReason.HighAngleNotPerpendicular]:
      'Bolt installed on a high degree angle, not perpendicular to the rockface',
    [PullTestAbortReason.RebarEjectedStopperCaught]:
      'Rebar ejected from bolt, visually popped, stopper has caught the bar',
    [PullTestAbortReason.BoltEndDamageRigNotEngaging]:
      'End of the bolt damage, rig not engaging the rock plate properly',
    [PullTestAbortReason.PullTestCollarInstalledBackwards]:
      'Pull test collar installed backwards',
    [PullTestAbortReason.BrokenBoltNut]: 'Broken bolt nut',
  };

  if (reason in abortReasonDisplayMap) {
    return abortReasonDisplayMap[reason as PullTestAbortReason];
  }
  return reason.toString();
};

export const getEarliestAndLatestDates = (results: BoltResult[]) => {
  if (!results || results.length === 0) {
    return { testingStartDate: '', testingEndDate: '' };
  }

  let earliest = new Date(results[0].createdAt);
  let latest = new Date(results[0].createdAt);

  for (const result of results) {
    const createdAt = new Date(result.createdAt);
    if (createdAt < earliest) earliest = createdAt;
    if (createdAt > latest) latest = createdAt;
  }

  return {
    testingStartDate: earliest.toLocaleDateString(),
    testingEndDate: latest.toLocaleDateString(),
  };
};

// Utility function for sorting alphanumeric strings by their numeric part
export const alphanumericSort = <T>(
  getValue: (item: T) => string | null | undefined,
) => {
  return (rowA: { original: T }, rowB: { original: T }) => {
    const valueA = getValue(rowA.original) || '';
    const valueB = getValue(rowB.original) || '';

    // Extract the first number found in each string
    const matchA = valueA.match(/\d+/);
    const matchB = valueB.match(/\d+/);

    const numA = matchA ? parseInt(matchA[0]) : 0;
    const numB = matchB ? parseInt(matchB[0]) : 0;

    // If numbers are different, sort by number
    if (numA !== numB) {
      return numA - numB;
    }

    // If numbers are the same, fall back to alphabetical sorting
    return valueA.localeCompare(valueB);
  };
};
