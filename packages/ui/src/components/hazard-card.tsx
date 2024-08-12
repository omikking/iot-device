import * as React from 'react';
import { Headline } from './headline';
import { Badge } from './badge';
import {
  LucideCircleCheckBig,
  LucideClipboardList,
  LucideOctagonAlert,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Textarea } from './textarea';
import { Text } from './text';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from './button';

interface HazardCardProps {
  datumTitle: string;
  badge: boolean;
  textLabel: string;
  hazardInfoItems: { titel: string; text: string }[];
}

export const HazardCard = (props: HazardCardProps) => {
  const formSchema = z.object({
    textarea: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textarea: '',
    },
  });

  return (
    <div className="ui-w-[644px] ui-flex ui-flex-col ui-border-2 ui-border-neutral-2">
      <div className="ui-flex ui-flex-row ui-border-b ui-border-neutral-2 ui-p-4 ui-items-center ui-justify-between">
        <Headline variant="medium" as="h3" color="foreground">
          {props.datumTitle}
        </Headline>
        {props.badge && (
          <Badge variant="destructive">
            <LucideOctagonAlert />
            Hazard
          </Badge>
        )}
      </div>

      <div className="ui-w-full ui-flex ui-flex-row ui-p-4 ui-px-2">
        <div className="ui-w-1/2 ui-p-2 ui-pt-6">
          {props.hazardInfoItems.map((item) => (
            <div
              key={`${item.titel}-${item.text}`}
              className="ui-flex ui-flex-row ui-px-2 ui-border-b ui-py-2"
            >
              <div className="ui-w-32">
                <Text variant="small" color="muted">
                  {item.titel}
                </Text>
              </div>
              <div className="ui-max-w-36">
                <Text variant="small" color="foreground">
                  {item.text}
                </Text>
              </div>
            </div>
          ))}
        </div>

        <div className="ui-w-1/2 ui-border-">
          <Form {...form}>
            <form
              onSubmit={() => console.log('submit form')}
              className="ui-w-full ui-flex ui-flex-row ui-justify-center"
            >
              <FormField
                control={form.control}
                name="textarea"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bolt could not be tested..."
                          className="ui-w-[293px] ui-h-[131px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="ui-flex flex-row ui-justify-end ui-p-4 ui-gap-4">
        <Button variant="primary" size="small">
          <LucideCircleCheckBig />
          Complete
        </Button>
        <Button variant="outline" size="small">
          <LucideClipboardList />
          View more
        </Button>
      </div>
    </div>
  );
};

export default HazardCard;
