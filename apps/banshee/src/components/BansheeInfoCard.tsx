'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Headline } from '@gsp/ui-core';
import bansheeImage from '../../../../packages/ui-core/src/images/banshee-xcell.webp';

export const BansheeInfoCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-bg-transparent ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-min-h-[400px] ui-banshee-cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="ui-banshee-relative ui-banshee-w-full ui-banshee-h-full ui-banshee-transition-transform ui-banshee-[transition-duration:1500ms] ui-banshee-ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="ui-banshee-absolute ui-banshee-inset-0 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-bg-neutral-1"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={bansheeImage}
            alt="Banshee xCell"
            className="ui-banshee-object-contain ui-banshee-max-h-[95%]"
          />
        </div>

        <div
          className="ui-banshee-absolute ui-banshee-inset-0 ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-p-4 ui-banshee-text-center ui-banshee-bg-neutral-1 ui-banshee-border ui-banshee-border-neutral-300"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Headline
            variant="large"
            color="foreground"
            as="h3"
            isBold
            className="ui-banshee-mb-2"
          >
            xCell Banshee
          </Headline>
          <p className="ui-banshee-text-2xl ui-banshee-text-neutral-500">
            xCell Banshee provides digital monitoring of consumed capacity for
            Sandvik MD and MDX Bolts. By enabling in-service testing and
            condition assessment of installed bolts, the solution delivers
            valuable insights into bolt performance and ground support
            effectiveness throughout the life of an excavation.
          </p>
        </div>
      </div>
    </div>
  );
};
