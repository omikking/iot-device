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
} from '@gsp/ui';
import { LucideTriangleAlert } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const boltInfoItems = [
  {
    title: 'Diameter',
    text: '66.40 cm',
    attribute: 'Material',
    value: 'Stainless Steel',
  },
  {
    title: 'Pass Criteria',
    text: 'N/A',
    attribute: 'Thread Type',
    value: 'Metric Coarse',
  },
  {
    title: 'Location',
    text: 'Södra Larmgatan 4, 411 16 Göteborg, Sweden',
    attribute: 'Weight',
    value: '15.75 kg',
  },
];

export const ViewBoltResultModal = () => {
  return (
    <ModalContent className="sm:max-w-[425px]">
      {/* ================== HEADER ================== */}
      <ModalHeader>
        <ModalTitle>View bolt result</ModalTitle>
      </ModalHeader>
      {/* ================== BODY ================== */}
      <div></div>
      <div className="p-10 w-full flex flex-row gap-10">
        <div className="flex flex-row">
          <Image
            src="/boltTestImage.png"
            alt="Large Image"
            width={390}
            height={280}
            className="rounded-md"
          />
        </div>

        <div className="w-1/2 h-full flex flex-col">
          <Text variant="small" color="foreground">
            Comment
          </Text>
          <Textarea placeholder="Add a comment" className="h-full"></Textarea>
          <div className="flex flex-row pt-5 justify-between">
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
      <div className="flex flex-col px-10 gap-4 pb-3">
        <Headline variant="medium" as="h3" color="foreground">
          Bolt specifications
        </Headline>

        {boltInfoItems.map((item) => (
          <div className="border-b border-neutral-3 flex px-2 py-3">
            {/* BOLT LEFT */}
            <div className="flex w-full">
              <div className="ui-w-32">
                <Text variant="small" color="muted">
                  {item.title}
                </Text>
              </div>
              <div className="ui-max-w-32">
                <Text variant="small" color="foreground">
                  {item.text}
                </Text>
              </div>
            </div>
            {/* BOLT RIGHT */}
            <div className="flex w-full">
              <div className="ui-w-32">
                <Text variant="small" color="muted">
                  {item.attribute}
                </Text>
              </div>
              <div className="ui-max-w-32">
                <Text variant="small" color="foreground">
                  {item.value}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalFooter className="px-10 py-5">
        <Button variant="outline" size="large" type="submit">
          Close
        </Button>
      </ModalFooter>
      {/* ================== FOOTER ================== */}
    </ModalContent>
  );
};
