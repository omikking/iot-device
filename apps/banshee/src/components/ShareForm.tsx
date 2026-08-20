import { Button, Input, Text } from '@gsp/ui-core';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

type ShareFormValues = {
  email: string;
};

export const ShareForm = ({
  form,
  onShare,
}: {
  form: UseFormReturn<ShareFormValues>;
  /**
   * Called with the recipient email when the form is submitted. The page is
   * responsible for generating the CSV/PNG and invoking the share mutation.
   */
  onShare?: (email: string) => Promise<void>;
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    if (!onShare) return;
    setIsSharing(true);
    try {
      await onShare(email);
    } finally {
      setIsSharing(false);
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <div className="ui-banshee-flex ui-banshee-mt-2 ui-banshee-flex-col ui-banshee-gap-2">
          <Text color="foreground" variant="small">
            Share Plot List
          </Text>

          <span className="ui-banshee-flex ui-banshee-max-w-[30%] ui-banshee-items-center ui-banshee-gap-2 ui-banshee-w-full">
            <Input
              {...form.register('email', { required: true })}
              placeholder="Email"
              type="email"
              disabled={isSharing}
            />
            <Button type="submit" disabled={isSharing}>
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          </span>
        </div>
      </form>
    </FormProvider>
  );
};
