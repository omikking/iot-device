'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { BoltResult } from '@/gql/graphql';
import { generateBoltSpecifications } from '@/libs/utils';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { Textarea, Text, Badge, Headline, Specification } from '@gsp/ui';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';
import { MultiBoltGraphView } from './MultiBoltGraphView';

type BoltResultDetailsModalContentProps = {
  boltResult: BoltResult;
  siteInfo: {
    levelName?: string;
    driveName?: string;
    locationName?: string;
  };
  fullName: string;
};

export const BoltResultDetailsModalContent = ({
  boltResult,
  siteInfo,
  fullName,
}: BoltResultDetailsModalContentProps) => {
  const {
    image,
    comment,
    isHazard,
    peakLoad,
    peakDisplacement,
    hazardCompletedDate,
  } = boltResult || {};

  const [imageError, setImageError] = useState(false);

  const imageUrl = image ? `${process.env.NEXT_PUBLIC_API_URL}${image}` : null;
  return (
    <div className="flex flex-col px-10 pt-10">
      {(imageUrl || comment) && (
        <div className="flex flex-grow gap-10">
          {imageUrl && !imageError && (
            <div className="flex flex-col w-1/2 pb-10">
              <Image
                src={imageUrl}
                alt="Attached bolt result image"
                width={388}
                height={256}
                className="rounded-md object-cover h-64"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          <div className="flex flex-col w-1/2">
            {comment && (
              <div className="flex flex-col flex-grow pb-10">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={comment}
                  className="mt-2 flex-grow min-h-48"
                  disabled
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        {!isHazard &&
          hazardCompletedDate &&
          hazardCompletedDate?.length > 0 && (
            <div className="pb-10">
              <Badge variant="success">
                <LucideCircleCheckBig />
                Completed
              </Badge>

              <Headline
                className="py-4"
                variant="small"
                as="h3"
                color="foreground"
                isBold
              >
                Hazard completion history
              </Headline>
              {hazardCompletedDate?.map((date, index) => {
                const dateString = new Date(date).toISOString().split('T')[0];
                return (
                  <div key={index} className="flex flex-wrap">
                    <Specification
                      isWide
                      key={index}
                      title={'Date'}
                      text={dateString}
                      className="w-1/2"
                    />
                    <Specification
                      isWide
                      title={''}
                      text={''}
                      className="w-1/2"
                    />
                  </div>
                );
              })}
            </div>
          )}
        <div className="flex flex-col gap-2 w-full">
          {isHazard && (
            <div className="pb-10">
              <Badge variant={'attention'}>
                <LucideTriangleAlert />
                Reported hazard
              </Badge>

              {(isHazard ||
                (hazardCompletedDate && hazardCompletedDate.length > 0)) && (
                <Specification
                  title="Reported by"
                  text={fullName || 'N/A'}
                  className="w-full mt-4"
                  isWide
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bolt Specifications */}
      <div className="pb-10">
        <Headline
          className="pb-4"
          variant="small"
          as="h3"
          color="foreground"
          isBold
        >
          Bolt specifications
        </Headline>

        {boltResult && (
          <div className="flex flex-wrap">
            {[...generateBoltSpecifications(boltResult, siteInfo)].map(
              (boltSpec, index) => (
                <Specification
                  isWide
                  key={index}
                  title={boltSpec.title}
                  text={boltSpec.text}
                  className="w-1/2"
                />
              ),
            )}
            {generateBoltSpecifications(boltResult, siteInfo).length % 2 ===
              1 && <Specification isWide title="" text="" className="w-1/2" />}
          </div>
        )}
      </div>

      {/* Bolt Results */}
      <div className="pb-10">
        <Headline variant="small" as="h3" color="foreground" isBold>
          Bolt results
        </Headline>
        <MultiBoltReadingTable
          peakLoad={peakLoad}
          peakDisplacement={peakDisplacement}
        />
      </div>
      {/* Bolt plot */}
      <div>
        <Headline variant="small" as="h3" color="foreground" isBold>
          Bolt plot
        </Headline>

        <MultiBoltGraphView
          peakLoad={peakLoad}
          peakDisplacement={peakDisplacement}
          boltNumber={boltResult?.boltNumber}
        />
      </div>
    </div>
  );
};
