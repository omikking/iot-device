import { Button, Input, Text } from '@gsp/ui-banshee';
import { FormProvider, UseFormReturn } from 'react-hook-form';

type ShareFormValues = {
  email: string;
};
export const ShareForm = ({
  form,
}: {
  form: UseFormReturn<ShareFormValues>;
}) => (
  <FormProvider {...form}>
    <form>
      <div className="ui-banshee-flex ui-banshee-mt-2 ui-banshee-flex-col ui-banshee-gap-2">
        <Text color="foreground" variant="small">
          Share Plot List
        </Text>

        <span className="ui-banshee-flex ui-banshee-max-w-[30%] ui-banshee-items-center ui-banshee-gap-2 ui-banshee-w-full">
          <Input
            {...form.register('email', { required: true })}
            placeholder="Email"
          />
          <Button type="submit">Share</Button>
        </span>
      </div>
    </form>
  </FormProvider>
);
