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
  boltDescription: string;
  viewBoltSpecifications: {
    title: string;
    text: string;
    attribute: string;
    value: string;
  }[];
}

export const ViewBoltResultModal = ({
  modalTitle,
  image,
  isHazard,
  boltDescription,
  viewBoltSpecifications,
}: ViewBoltResultModalProps) => {
  return (
    <ModalContent className="sm:max-w-[425px]">
      {/* ================== HEADER ================== */}
      <ModalHeader>
        <ModalTitle>{modalTitle}</ModalTitle>
      </ModalHeader>
      {/* ================== BODY ================== */}

      <div className="p-10 flex gap-10 flex-grow min-h-[]">
        {image && (
          <div className="flex flex-row min-h-52">
            <Image
              src={image}
              alt="Large Image"
              width={390}
              height={280}
              className="rounded-md"
            />
          </div>
        )}

        <div className="flex flex-col w-1/2 min-h-[280px]">
          {!boltDescription && (
            <div className="flex flex-col flex-grow">
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

          <div className="flex pt-5 justify-between">
            <Badge variant={'warning'}>
              <LucideTriangleAlert />
              Reported hazard
            </Badge>
            <Text variant="small" color="foreground">
              Author: Tyrell Wellick
            </Text>
          </div>
        </div>
      </div>
      {/* ================== BOLT SPEC ================== */}
      {/* <div className="flex flex-col px-10 gap-4"> */}
      <div className=" px-10">
        <div className="pb-4">
          <Headline variant="smallBold" as="h3" color="foreground">
            Bolt specifications
          </Headline>
        </div>

        {viewBoltSpecifications.map((item, index) => (
          <div
            // className="flex border-b border-neutral-3 p-2"
            className="flex border-b border-neutral-3 py-2"
            key={`${item.title}-${index}`}
          >
            {/* BOLT LEFT */}
            <div className="flex items-center w-full px-2">
              <div className="w-32">
                <Text variant="small" color="muted">
                  {item.title}
                </Text>
              </div>
              <div className="max-w-32">
                <Text variant="small" color="foreground">
                  {item.text}
                </Text>
              </div>
            </div>
            {/* BOLT RIGHT */}
            <div className="flex items-center w-full px-">
              <div className="w-32">
                <Text variant="small" color="muted">
                  {item.attribute}
                </Text>
              </div>
              <div className="max-w-32">
                <Text variant="small" color="foreground">
                  {item.value}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalFooter className="px-10 pb-5 pt-8">
        <ModalClose asChild>
          <Button variant="outline" size="large" type="submit">
            Close
          </Button>
        </ModalClose>
      </ModalFooter>
      {/* ================== FOOTER ================== */}
    </ModalContent>
  );
};
