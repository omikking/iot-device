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
      {/* ================== HEADER ================== */}
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
      {/* ================== BODY ================== */}
      <div className="p-10 flex gap-10 flex-grow ">
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
      {/* ================== BOLT SPEC ================== */}
      <div className="px-10">
        <div className="pb-4">
          <Headline variant="smallBold" as="h3" color="foreground">
            Bolt specifications
          </Headline>
        </div>
        <div className="flex flex-row flex-wrap">
          {viewBoltSpecifications.map((boltSpec, index) => (
            <div
              key={index}
              className="flex flex-row w-1/2 items-center px-2 py-2 border-b border-neutral-3"
            >
              {/* BOLT LEFT */}
              <div className="w-32">
                <Text variant="small" color="muted">
                  {boltSpec.title}
                </Text>
              </div>
              {/* BOLT RIGHT */}
              <div className="max-w-60">
                <Text variant="small" color="foreground">
                  {boltSpec.text}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ================== FOOTER ================== */}
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
