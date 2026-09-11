'use client';

import { Input, Button, Text } from '@gsp/ui-banshee';

export const BansheeSharePlot = () => {
  return (
    <div className="ui-banshee-mt-8 ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-2">
      <Text
        variant="small"
        color="foreground"
        className="ui-banshee-font-semibold"
      >
        Share plot list
      </Text>
      <div className="ui-banshee-flex ui-banshee-flex-wrap ui-banshee-gap-4 ui-banshee-max-w-md">
        <Input
          placeholder="Email"
          className="ui-banshee-flex-1 ui-banshee-min-w-[200px]"
        />
        <Button
          variant="primary"
          size="small"
          className="ui-banshee-bg-blue-600 ui-banshee-text-white"
        >
          Share
        </Button>
      </div>
    </div>
  );
};
