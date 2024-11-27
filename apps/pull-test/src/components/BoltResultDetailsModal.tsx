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
} from '@gsp/ui';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { BoltResultSchema } from '@/app/mock/mock';

interface BoltResultDetailsModalProps {
  modalTitle: string;
  fullBoltData?: BoltResultSchema;
  onClose?: () => void;
}

interface BoltSpecification {
  title: string;
  text: string;
}

export const BoltResultDetailsModal = ({
  modalTitle,
  fullBoltData,
  onClose,
}: BoltResultDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    image,
    isHazard,
    peakLoad,
    peakDisplacement,
    drive,
    bitSize,
    boltType,
    boltNumber,
    rotations,
    level,
    ring,
    author,
  } = (fullBoltData as BoltResultSchema) || {};
  // @TODO Just hardcoded for now, update later. Image should be here as well most likely
  const boltDescription = 'Test description';

  const specifications: BoltSpecification[] = [
    { title: 'Bolt', text: boltNumber },
    { title: 'Bit size', text: bitSize },
    { title: 'Level', text: level },
    { title: 'Drive', text: drive },
    { title: 'Position in ring', text: ring },
    { title: 'Rotations', text: rotations },
    { title: 'Pass criteria', text: boltType },
  ];

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

      console.log('isCompleted', isCompleted);
      if (isCompleted) {
        setTimeout(() => {
          console.log('MUSTAAARD');
          onClose?.();
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
        {isCompleted ? (
          <ModalTitle>Complete hazard</ModalTitle>
        ) : (
          <ModalTitle>{modalTitle}</ModalTitle>
        )}
      </ModalHeader>

      {/* First View - Main Content */}
      <div
        className={`transition-all duration-500 ${
          isCompleted || isConfirmed ? 'hidden' : 'block'
        }`}
      >
        <div className="p-10 flex gap-10 flex-grow">
          {image && (
            <Image
              src={image}
              alt="Attached bolt result image"
              width={390}
              height={280}
              className="rounded-md h-72"
            />
          )}
          <div className="flex flex-col w-1/2">
            {boltDescription && (
              <div className="flex flex-col flex-grow ">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={boltDescription}
                  className="flex-grow"
                  disabled
                  readOnly
                />
              </div>
            )}
            {isHazard && (
              <div className="flex justify-between pt-5">
                <Badge variant={'warning'}>
                  <LucideTriangleAlert />
                  Reported hazard
                </Badge>
                {author && (
                  <Text variant="small" color="foreground">
                    Author: {author}
                  </Text>
                )}
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
            {specifications.map((boltSpec, index) => (
              <div
                key={index}
                className="flex w-1/2 items-center px-2 py-2 border-b border-neutral-3 break-words"
              >
                <Text className="w-32" variant="small" color="muted">
                  {boltSpec.title}
                </Text>
                <Text className="max-w-60" variant="small" color="foreground">
                  {boltSpec.text}
                </Text>
              </div>
            ))}
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

      {/* Second View - Completion Confirmation */}
      <div
        className={`flex items-center justify-center transition-all duration-500 ${
          isCompleted && !isConfirmed ? 'opacity-100 block' : 'opacity-0 hidden'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-48 gap-6 p-4">
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
            You are about to complete the selected hazard. Are you sure you want
            to complete it?
          </Text>
        </div>
      </div>

      {/* Third View - Success Message */}
      <div
        className={`flex items-center justify-center transition-all duration-500 ${
          isConfirmed && !isSuccessful
            ? 'opacity-100 block'
            : 'opacity-0 hidden'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-48 gap-6 p-4">
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />
            <Headline as="h3" color="foreground" variant="small" isBold>
              Hazard completed
            </Headline>
          </div>
        </div>
      </div>

      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <div className="flex justify-end items-center gap-5">
            {isHazard && (
              <div>
                {isLoading ? (
                  <Button size="large" variant="primary">
                    <LoadingSpinner className="animate-spin" size={24} />
                    Complete
                  </Button>
                ) : (
                  !isConfirmed && (
                    <Button
                      size="large"
                      variant="primary"
                      onClick={isCompleted ? hazardConfirmed : completeHazard}
                    >
                      <LucideCircleCheckBig />
                      Complete
                    </Button>
                  )
                )}
              </div>
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
