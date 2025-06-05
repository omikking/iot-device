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
  Specification,
} from '@gsp/ui';
import Image from 'next/image';
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import { generateBoltSpecifications } from '@/libs/utils';
import { graphql } from '@/gql';
import { useQuery } from 'urql';

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

  const hazardConfirmed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      !isConfirmed ? setIsConfirmed(true) : setIsSuccessful(true);
      setIsLoading(false);

      if (isCompleted) {
        setTimeout(() => {
          onClose?.();

          setTimeout(() => {
            resetConfirmation();
          }, 200);
        }, 1000);
      }
    }, 1000);
  };

  const resetConfirmation = () => {
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
          <div className="flex px-10 pb-10 gap-10">
            {image && (
              <div>
                <Image
                  src={'/capybara.jpg'}
                  alt="Attached bolt result image"
                  width={390}
                  height={280}
                  className="rounded-md h-72 mt-10"
                />
                {!boltResult.comment && (
                  <div className="flex pt-5 gap-4 items-center">
                    <Badge variant={'attention'}>
                      <LucideTriangleAlert />
                      Reported hazard
                    </Badge>
                    <Text variant="small" color="foreground">
                      Reported by: {nameData?.user?.fullName || 'N/A'}
                    </Text>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col w-1/2 ">
              {boltResult.comment && (
                <div className="flex flex-col pt-10 h-full">
                  <Text variant="small" color="foreground">
                    Comment
                  </Text>
                  <Textarea
                    value={
                      'boltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.commentboltResult.comment'
                    }
                    className="mt-2 flex-grow h-[213px]"
                    disabled
                    readOnly
                  />
                </div>
              )}
              {isHazard && boltResult.comment && (
                <div className="flex pt-5 gap-4 items-center">
                  <Badge variant={'attention'}>
                    <LucideTriangleAlert />
                    Reported hazard
                  </Badge>
                  <Text variant="small" color="foreground">
                    Reported by: {nameData?.user?.fullName || 'N/A'}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-10 pb-10 pt-5">
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
              isConfirmed && !isSuccessful
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
                isLoading={isLoading}
                onClick={isCompleted ? hazardConfirmed : completeHazard}
              >
                {!isLoading && <LucideCircleCheckBig />}
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
