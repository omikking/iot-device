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
import React, { useState } from 'react';
import { BoltResult } from '@/gql/graphql';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';

type BoltResultDetailsModalProps = {
  modalTitle: string;
  fullBoltData?: BoltResult;
  onClose?: () => void;
  isHazardCompletable?: boolean;
  boltInfoItems: {
    title: string;
    text: string;
  }[];
};

export const BoltResultDetailsModal = ({
  modalTitle,
  isHazardCompletable = false,
  fullBoltData,
  boltInfoItems,
  onClose,
}: BoltResultDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { image, isHazard, peakLoad, peakDisplacement } =
    (fullBoltData as BoltResult) || {};
  // @TODO Just hardcoded for now, update later. Image should be here as well most likely
  const boltDescription = 'Test description';

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
        <ModalTitle>{isCompleted ? 'Complete hazard' : modalTitle}</ModalTitle>
      </ModalHeader>

      {/* First View */}
      <div
        className={`transition-all duration-500 ${
          isCompleted || isConfirmed ? 'hidden' : 'block'
        }`}
      >
        <div className="p-10 flex gap-10 flex-grow">
          {image && (
            <Image
              // src={image || '/images/placeholder.png'}
              src={'/images/placeholder.png'}
              alt="Attached bolt result image"
              width={390}
              height={280}
              className="rounded-md h-72"
            />
          )}
          <div className="flex flex-col w-1/2 ">
            {boltDescription && (
              <div className="flex flex-col flex-grow">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={boltDescription}
                  className="mt-2 flex-grow"
                  disabled
                  readOnly
                />
              </div>
            )}
            {isHazard && (
              <div className="flex justify-between pt-5">
                <Badge variant={'attention'}>
                  <LucideTriangleAlert />
                  Reported hazard
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="px-10 pb-10">
          <Headline
            className="pb-4"
            variant="small"
            as="h3"
            color="foreground"
            isBold
          >
            Bolt specifications
          </Headline>
          <div className="flex flex-wrap">
            {[...boltInfoItems.slice(1)].map((boltSpec, index) => (
              <Specification
                key={index}
                title={boltSpec.title}
                text={boltSpec.text}
                className="w-1/2"
              />
            ))}
            {boltInfoItems.length % 2 === 0 && (
              <Specification title="" text="" className="w-1/2" />
            )}
          </div>
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
        {/* Bolt plot */}
        <div className="px-10">
          <Headline
            className="pb-4"
            variant="small"
            as="h3"
            color="foreground"
            isBold
          >
            Bolt plot Graph
          </Headline>
          <Text variant="small" color="foreground">
            Graph will be shown here. Incoming feature...
          </Text>
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
