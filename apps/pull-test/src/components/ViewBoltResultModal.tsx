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
  LoadingSpinner,
} from '@gsp/ui';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface ViewBoltResultModalProps {
  modalTitle: string;
  image: string;
  isHazard: boolean;
  author?: string;
  boltDescription: string;
  viewBoltSpecifications: {
    title: string;
    text: string;
  }[];
}

export const ViewBoltResultModal = ({
  modalTitle,
  image,
  isHazard,
  author,
  boltDescription,
  viewBoltSpecifications,
}: ViewBoltResultModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccessFull, setIsSuccessFull] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const completeHazard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsCompleted(true);
  };

  const hazardConfirmed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      !isConfirmed ? setIsConfirmed(true) : setIsSuccessFull(true);
      setIsLoading(false);
    }, 1000);
  };

  const resetConfirmation = () => {
    setIsCompleted(false);
    setIsSuccessFull(false);
    setIsConfirmed(false);
  };

  return (
    <ModalContent className="max-h-full overflow-y-auto">
      <ModalHeader>
        {isCompleted ? (
          <ModalTitle>Complete hazard</ModalTitle>
        ) : (
          <ModalTitle>{modalTitle}</ModalTitle>
        )}
      </ModalHeader>

      {/* First View */}
      <div
        className={`transition-all duration-500 ${
          isCompleted || isConfirmed
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 pointer-events-none'
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
              <div className="flex flex-col flex-grow">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={boltDescription}
                  className="flex-grow mt-2"
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
        <div className="px-10">
          <Headline
            className="pb-4"
            variant="smallBold"
            as="h3"
            color="foreground"
          >
            Bolt specifications
          </Headline>
          <div className="flex flex-wrap">
            {viewBoltSpecifications.map((boltSpec, index) => (
              <Specification
                key={index}
                title={boltSpec.title}
                text={boltSpec.text}
                className="w-1/2"
              />
            ))}
          </div>
        </div>
      </div>
      {/* SECOND view */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isCompleted && !isConfirmed
            ? 'opacity-100 translate-y-0 pointer-events-none'
            : 'opacity-0 translate-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-96 gap-10">
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />
            <Headline as="h3" color="foreground" variant="smallBold">
              Confirm hazard completion
            </Headline>
          </div>
          <Text
            className="text-center w-2/3"
            color={'foreground'}
            variant={'medium'}
          >
            You are about to complete the selected hazard. Are you sure you want
            to complete it?
          </Text>
        </div>
      </div>
      {/* THIRD view */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isConfirmed && !isSuccessFull
            ? 'opacity-100 translate-y-[-10px] pointer-events-none'
            : 'opacity-0 translate-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-96 gap-10">
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />
            <Headline as="h3" color="foreground" variant="smallBold">
              Hazard completed
            </Headline>
          </div>
        </div>
      </div>
      <div>
        <ModalFooter className="px-10 pb-5 pt-8">
          <ModalClose asChild>
            <div className="flex gap-5">
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
                  Cancel
                </Button>
              ) : (
                <Button variant="outline" size="large">
                  Close
                </Button>
              )}
            </div>
          </ModalClose>
        </ModalFooter>
      </div>
    </ModalContent>
  );
};
