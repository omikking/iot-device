'use client';
import React from 'react';
import Image from 'next/image';
import { BoltResult } from '@/gql/graphql';
import { generateBoltSpecifications } from '@/libs/utils';
import { MultiBoltReadingTable } from './MultiBoltReadingTable';
import { Textarea, Text, Badge, Headline, Specification } from '@gsp/ui';
import { LucideCircleCheckBig, LucideTriangleAlert } from 'lucide-react';

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
  const { image, isHazard, peakLoad, peakDisplacement } = boltResult || {};

  return (
    <div className="flex flex-col">
      {/* Image, Comment and Hazard Status */}
      {(image || boltResult.comment || isHazard) && (
        <div className="flex flex-grow pb-5 px-10 gap-10">
          {image && (
            <Image
              src={'/capybara.jpg'}
              alt="Attached bolt result image"
              width={390}
              height={280}
              className="rounded-md h-72 mt-10"
            />
          )}
          <div className="flex flex-col w-1/2">
            {boltResult.comment && (
              <div className="flex flex-col flex-grow pt-10">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
                <Textarea
                  value={boltResult.comment}
                  className="mt-2 flex-grow min-h-48"
                  disabled
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      )}

      {isHazard && (
        <div className="flex flex-col px-10 pt-2 gap-2 w-full">
          <Badge variant={'attention'}>
            <LucideTriangleAlert />
            Reported hazard
          </Badge>
          <Specification
            title="Reported by"
            text={fullName || 'N/A'}
            className="w-full"
            isWide
          />
        </div>
      )}

      {!isHazard && (
        <div className="px-10">
          <Badge variant="success">
            <LucideCircleCheckBig />
            Completed
          </Badge>
        </div>
      )}

      <div className="px-10 pt-10">
        {/* Hazard Completion History */}
        {!boltResult?.isHazard && (
          <>
            <Headline
              className="pb-4"
              variant="small"
              as="h3"
              color="foreground"
              isBold
            >
              Hazard completion history
            </Headline>
            <div className="pb-10">
              {boltResult?.hazardCompletedDate?.map((date, index) => {
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
          </>
        )}

        {/* Bolt Specifications */}
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
            {[...generateBoltSpecifications(boltResult, siteInfo).slice(1)].map(
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
              0 && <Specification isWide title="" text="" className="w-1/2" />}
          </div>
        )}

        {/* Bolt Results */}
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
    </div>
  );
};
