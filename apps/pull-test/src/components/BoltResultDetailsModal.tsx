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
import React from 'react';
import Image from 'next/image';
import { LucideTriangleAlert } from 'lucide-react';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { BoltResultSchema } from '@/app/mock/mock';

interface BoltResultDetailsModalProps {
  modalTitle: string;
  fullBoltData?: BoltResultSchema;
}

interface BoltSpecification {
  title: string;
  text: string;
}

export const BoltResultDetailsModal = ({
  modalTitle,
  fullBoltData,
}: BoltResultDetailsModalProps) => {
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
  } = (fullBoltData as BoltResultSchema) || {};
  // @TODO Just hardcoded for now, update later. Image should be here as well most likely
  const boltDescription = 'Test description';
  const author = 'Angela Moss';
  const specifications: BoltSpecification[] = [
    { title: 'Bolt', text: boltNumber },
    { title: 'Bit size', text: bitSize },
    { title: 'Level', text: level },
    { title: 'Drive', text: drive },
    { title: 'Position in ring', text: ring },
    { title: 'Rotations', text: rotations },
    { title: 'Pass criteria', text: boltType },
    { title: 'Pass criteria', text: boltType },
  ];
  return (
    <ModalContent className="w-96 overflow-y-auto">
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
      <div className="p-10 flex gap-10 flex-grow h-full">
        {image && (
          <Image
            src="/boltTestImage.png"
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
              <Badge variant={'attention'}>
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
            <Specification
              key={index}
              title={boltSpec.title}
              text={boltSpec.text}
              className="w-1/2"
            />
          ))}
          {specifications.length % 2 === 1 && (
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
