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

export const HazardCard = () => {
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
      {/* =============== HEADER =============== */}
      <div className="ui-flex ui-flex-row ui-border-b ui-border-neutral-2 ui-p-4 ui-items-center ui-justify-between">
        <Headline variant="medium" as="h3" color="foreground">
          2021-05-23
        </Headline>
        <Badge variant="destructive">
          <LucideOctagonAlert />
          Hazard
        </Badge>
      </div>
      {/* =============== BODY =============== */}
      {/* =============== TEXT =============== */}
      <div className="ui-w-full ui-flex ui-flex-row ui-p-4 ui-px-2">
        <div className="ui-w-1/2 ui-p-2 ui-pt-6">
          <div className="ui-flex ui-flex-row ui-px-2 ui-border-b ui-py-2">
            <div className="ui-w-32">
              <Text variant="small" color="muted">
                Diameter
              </Text>
            </div>
            <div>
              <Text variant="small" color="foreground">
                66.40 cm
              </Text>
            </div>
          </div>
          <div className="ui-flex ui-flex-row ui-px-2 ui-border-b ui-py-2">
            <div className="ui-w-32">
              <Text variant="small" color="muted">
                Pass Criteria
              </Text>
            </div>
            <div>
              <Text variant="small" color="foreground">
                N/A
              </Text>
            </div>
          </div>
          <div className="ui-flex ui-flex-row ui-px-2 ui-border-b ui-py-2">
            <div className="ui-w-32">
              <Text variant="small" color="muted">
                Location
              </Text>
            </div>
            <div>
              <Text variant="small" color="foreground">
                Ostgatan 15
              </Text>
            </div>
          </div>
        </div>
        {/* =============== TEXT AREA =============== */}
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
      {/* =============== BUTTONS =============== */}
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
