import React from 'react';
import {
  UserSchema,
  chartDataMock,
  chartItemsMock,
  chartConfigMock,
  lineDataChartMock,
  lineDataConfigMock,
  usersDesignSystemMock,
  optionsDesignSystemMock,
} from '@/app/mock/mock';
import Image from 'next/image';
import { ChartPieDonut, ContentHolder } from '@gsp/ui-banshee';
import bansheeImage from '../../../../../../packages/ui-banshee/src/images/banshee-xcell.png';

export default function Page() {
  return (
    <div className="ui-banshee-h-[424px] ui-banshee-flex ui-banshee-flex-row ui-banshee-p-5 ui-banshee-gap-8">
      {/* <div className="ui-banshee-h- ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-8"> */}
      <ContentHolder variant="image">
        <Image
          className="ui-banshee-min-w-[315px] ui-banshee-min-h-[315px]  ui-banshee-object-cover"
          src={bansheeImage}
          alt="Example Image"
          // width={500}
          // height={500}
        />
      </ContentHolder>
      <div className="ui-banshee-h-[424px] ui-banshee-w-96 ui-banshee-flex ">
        <ChartPieDonut
          chartData={chartDataMock}
          chartConfig={chartConfigMock}
          chartItems={chartItemsMock}
        />
      </div>
    </div>
    // </div>
  );
}
