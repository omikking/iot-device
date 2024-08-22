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
} from '@gsp/ui';
import { LucideTriangleAlert } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

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
  return (
    <ModalContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
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
              <Badge variant={'destructive'}>
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
          <Button variant="outline" size="large" type="submit">
            Close
          </Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  );
};
