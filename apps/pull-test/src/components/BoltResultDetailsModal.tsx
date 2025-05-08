import {
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Textarea,
  Text,
  Badge,
  Headline,
  ModalClose,
  LoadingSpinner,
  Specification,
} from '@gsp/ui';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import { generateBoltSpecifications } from '@/libs/utils';
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';

type BoltResultDetailsModalProps = {
  boltResult: BoltResult;
  onClose?: () => void;
  isHazardCompletable?: boolean;
};

const getLevelDetails = graphql(`
  query getLevelDetails($id: String!) {
    level(id: $id) {
      id
      levelName
      siteId
    }
  }
`);

const getDriveDetails = graphql(`
  query getDriveDetails($id: String!) {
    drive(id: $id) {
      id
      driveName
    }
  }
`);

const getLocationDetails = graphql(`
  query getLocationDetails($id: String!) {
    location(id: $id) {
      id
      locationName
    }
  }
`);

const getNameDetails = graphql(`
  query getNameDetails($id: String!) {
    user(id: $id) {
      fullName
    }
  }
`);

const updateHazard = graphql(`
  mutation updateBoltResult(
    $id: String!
    $updateBoltResultInput: UpdateBoltResultInput!
  ) {
    updateBoltResult(id: $id, updateBoltResultInput: $updateBoltResultInput) {
      isHazard
      hazardCompletedDate
    }
  }
`);

export const BoltResultDetailsModal = ({
  isHazardCompletable = false,
  boltResult,
  onClose,
}: BoltResultDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Level Query
  const [{ data: levelData }] = useQuery({
    query: getLevelDetails,
    variables: { id: boltResult?.levelId },
  });

  // Drive Query
  const [{ data: driveData }] = useQuery({
    query: getDriveDetails,
    variables: { id: boltResult?.driveId },
  });

  // Location Query
  const [{ data: locationData }] = useQuery({
    query: getLocationDetails,
    variables: { id: boltResult?.locationId },
  });

  // Name Query
  const [{ data: nameData }] = useQuery({
    query: getNameDetails,
    variables: { id: boltResult?.userId },
  });

  // const [, updateReportedHazard] = useMutation(updateHazard);
  const [, updateReportedHazard] = useMutation(updateHazard);

  const levelName = levelData?.level?.levelName || 'N/A';
  const driveName = driveData?.drive?.driveName || 'N/A';
  const locationName = locationData?.location?.locationName || 'N/A';

  const siteInfo = {
    levelName: levelName,
    driveName: driveName,
    locationName: locationName,
  };

  const { image, isHazard, peakLoad, peakDisplacement } =
    (boltResult as BoltResult) || {};

  const completeHazard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsCompleted(true);
  };

  const hazardConfirmed = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
    setIsLoading(true);

    const currentHazardDates = Array.isArray(boltResult.hazardCompletedDate)
      ? boltResult.hazardCompletedDate
      : [];

    setTimeout(async () => {
      try {
        setTimeout(async () => {
          await updateReportedHazard({
            id: boltResult.id,
            updateBoltResultInput: {
              isHazard: false,
              hazardCompletedDate: [...currentHazardDates, Date.now()],
            },
          });
        }, 1000);
        setIsSuccessful(true);
        setIsConfirmed(true);
      } catch (error) {
        setIsSuccessful(false);
        //TODO Set an error toast here
      }
      setIsLoading(false);

      if (isCompleted) {
        setTimeout(() => {
          onClose?.();
          resetConfirmation();
        }, 2000);
      }
    }, 1000);
  };

  const resetConfirmation = () => {
    console.log('resetConfirmation called');
    setIsCompleted(false);
    setIsSuccessful(false);
    setIsConfirmed(false);
    setIsLoading(false);
  };

  return (
    <ModalContent
      onEscapeKeyDown={resetConfirmation}
      onPointerDownOutside={resetConfirmation}
      className={`overflow-y-auto w-96 ${
        isCompleted || isConfirmed ? 'h-[450px]' : ''
      }`}
    >
      <ModalHeader>
        <ModalTitle>
          {isCompleted ? 'Complete hazard' : `Bolt ${boltResult?.boltNumber}`}
        </ModalTitle>
      </ModalHeader>

      {/* First View */}
      <div
        className={`transition-all duration-500 ${
          isCompleted || isConfirmed ? 'hidden' : 'block'
        }`}
      >
        {(image || boltResult.comment || isHazard) && (
          <div className="flex flex-grow pb-5 px-10 gap-10">
            {image && (
              <Image
                src={'/capybara.jpg'}
                alt="Attached bolt result image"
                width={390}
                height={280}
                className="rounded-md h-72 mt-10"
              />
            )}
            <div className="flex flex-col w-1/2 ">
              {boltResult.comment && (
                <div className="flex flex-col flex-grow pt-10">
                  <Text variant="small" color="foreground">
                    Comment
                  </Text>
                  <Textarea
                    value={boltResult.comment}
                    className="mt-2 flex-grow"
                    disabled
                    readOnly
                  />
                </div>
              )}
              <div className="flex pt-5 gap-4 items-center">
                {isHazard && (
                  <>
                    <Badge variant={'attention'}>
                      <LucideTriangleAlert />
                      Reported hazard
                    </Badge>
                    <Text variant="small" color="foreground">
                      Reported by: {nameData?.user?.fullName || 'N/A'}
                    </Text>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {!isHazard && (
          <div className="px-10">
            <Badge variant="success">
              <LucideCircleCheckBig />
              Completed
            </Badge>
          </div>
        )}
        <div className="px-10 pt-10">
          {!boltResult?.isHazard && (
            <>
              <Headline
                className="pb-4"
                variant="small"
                as="h3"
                color="foreground"
                isBold
              >
                Hazard completion history
              </Headline>
              <div className="pb-10">
                {boltResult?.hazardCompletedDate?.map((date, index) => {
                  const dateString = new Date(date).toISOString().split('T')[0];
                  return (
                    <div key={index} className="flex flex-wrap">
                      <Specification
                        key={index}
                        title={'Date'}
                        text={dateString}
                        className="w-1/2"
                      />
                      <Specification title={''} text={''} className="w-1/2" />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <Headline
            className="pb-4"
            variant="small"
            as="h3"
            color="foreground"
            isBold
          >
            Bolt specifications
          </Headline>

          {boltResult && (
            <>
              <div className="flex flex-wrap">
                {[
                  ...generateBoltSpecifications(boltResult, siteInfo).slice(1),
                ].map((boltSpec, index) => (
                  <Specification
                    key={index}
                    title={boltSpec.title}
                    text={boltSpec.text}
                    className="w-1/2"
                  />
                ))}
                {generateBoltSpecifications(boltResult, siteInfo).length % 2 ===
                  0 && <Specification title="" text="" className="w-1/2" />}
              </div>
            </>
          )}

          {/* BOLT RESULTS */}
          <div>
            <Headline
              className="pt-10"
              variant="small"
              as="h3"
              color="foreground"
              isBold
            >
              Bolt results
            </Headline>
            <MultiBoltReadingTable
              peakLoad={peakLoad}
              peakDisplacement={peakDisplacement}
            />
          </div>
        </div>
      </div>
      {isCompleted && (
        <div className="relative h-[250px]">
          {/* Second View */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isCompleted && !isConfirmed ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-6 p-4">
              <div className="flex gap-4">
                <LucideCircleCheckBig size={30} className="text-success" />
                <Headline as="h3" color="foreground" variant="small" isBold>
                  Confirm hazard completion
                </Headline>
              </div>
              <Text
                className="text-center w-2/3"
                color="foreground"
                variant="medium"
              >
                You are about to complete the selected hazard. Are you sure you
                want to complete it?
              </Text>
            </div>
          </div>
          {/* Third View */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isConfirmed && isSuccessful
                ? 'opacity-100 translate-y-[-10px] z-10'
                : 'opacity-0 translate-y-0 z-0'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-6 p-4">
              <div className="flex gap-4">
                <LucideCircleCheckBig size={30} className="text-success" />
                <Headline as="h3" color="foreground" variant="small" isBold>
                  Hazard completed
                </Headline>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <div className="flex justify-end items-end gap-5">
            {isHazard && isHazardCompletable && (
              <Button
                size="large"
                variant="primary"
                disabled={isConfirmed}
                onClick={isCompleted ? hazardConfirmed : completeHazard}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucideCircleCheckBig />
                )}
                Complete
              </Button>
            )}
            {isCompleted ? (
              <Button
                variant="outline"
                size="large"
                onClick={resetConfirmation}
              >
                {isConfirmed ? 'Close' : 'Cancel'}
              </Button>
            ) : (
              <Button variant="outline" size="large">
                Close
              </Button>
            )}
          </div>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  );
};
