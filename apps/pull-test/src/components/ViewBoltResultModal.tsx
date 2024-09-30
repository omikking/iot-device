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
  const [isSuccessFull, setIsSuccessFull] = useState(false);

  const activateSpinner = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccessFull(true);
    }, 1000);
  };

  return (
    <ModalContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isSuccessFull
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-96 gap-10 text-center">
          <div className="flex gap-4">
            <LucideCircleCheckBig size={30} className="text-success" />
            <Headline as="h3" color="foreground" variant="smallBold">
              Successfully saved
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
      <div
        className={`transition-all duration-500 ${
          isSuccessFull ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        </div>

        <ModalFooter className="px-10 pb-5 pt-8">
          <ModalClose asChild>
            <div className="flex gap-5">
              {isHazard && (
                <div>
                  {isLoading ? (
                    <Button
                      type="submit"
                      size="large"
                      variant="primary"
                      disabled
                    >
                      <LoadingSpinner className="animate-spin" size={24} />
                      Complete
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="large"
                      variant="primary"
                      onClick={activateSpinner}
                    >
                      <LucideCircleCheckBig />
                      Complete
                    </Button>
                  )}
                </div>
              )}

              <Button variant="outline" size="large">
                Close
              </Button>
            </div>
          </ModalClose>
        </ModalFooter>
      </div>
    </ModalContent>
  );
};
