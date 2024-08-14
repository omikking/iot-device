import {
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Textarea,
} from '@gsp/ui';
import Image from 'next/image';
import React from 'react';

export const ViewBoltResultModal = () => {
  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle>View bolt result</ModalTitle>
      </ModalHeader>
      <div className="flex flex-row p-10">
        <Image
          src="/boltTestImage.png"
          alt="Large Image"
          width={390}
          height={280}
        />
        GAP
        <div>
          dawdwa
          <Textarea>daw</Textarea>
          <div>badge author: Tyrell Wllick</div>
        </div>
      </div>
      <div className="">daw</div>
      <ModalFooter className="px-10 py-5">
        <Button variant="outline" size="small" type="submit">
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
