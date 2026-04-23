'use client';

import { SidebarInset } from '@gsp/ui-banshee';
import { Headline } from '@gsp/ui-banshee';
import { Text } from '@gsp/ui-banshee';
import { Textarea } from '@gsp/ui-banshee';
import { Button } from '@gsp/ui-banshee';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui-banshee';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import {
  ContactFormValues,
  contactFormSchema,
} from '@/components/schemas/ContactFormSchema';

interface Attachment {
  id: string;
  name: string;
  size: string;
}

export default function ContactUsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: '1', name: 'File name', size: 'size kb' },
    { id: '2', name: 'File name', size: 'size kb' },
  ]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: 'Osvaldo Vallati',
      email: 'Osvaldo.vallati@sandvik.com',
      message: '',
    },
  });

  const documents = [
    {
      name: 'xCell Cyclops Instruction Manual E V2.en',
      type: 'PDF document',
      size: '1276 kB',
    },
    {
      name: 'xCell Cyclops System Overview E V2.en',
      type: 'PDF document',
      size: '1276 kB',
    },
  ];

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleAttachFile = () => {
    inputRef.current?.click();
  };

  const handleSendMessage = (values: ContactFormValues) => {
    console.log('Send message clicked', values, attachments);
  };

  const handleAddAttachments = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const fileList = e.target.files;
    if (!fileList) return;

    const files: File[] = Array.from(fileList);

    const newFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      file,
    }));

    setAttachments((prev) => [...prev, ...newFiles]);

    e.target.value = '';
  };

  return (
    <SidebarInset>
      <main className="ui-banshee-bg-main-white ui-banshee-box-border">
        <Headline
          as="h1"
          variant="large"
          color="foreground"
          className="ui-banshee-p-3 md:ui-banshee-p-4 lg:ui-banshee-p-6 ui-banshee-border-b ui-banshee-border-gray-200"
        >
          How can we help?
        </Headline>

        <div className="ui-banshee-grid ui-banshee-grid-cols-1 lg:ui-banshee-grid-cols-[1fr_2fr] ui-banshee-gap-8">
          <div className="ui-banshee-bg-white ui-banshee-p-6">
            <Text
              variant="small"
              color="foreground"
              className="ui-banshee-mb-6"
            >
              Download documents
            </Text>

            <div className="ui-banshee-space-y-4">
              {documents.map((doc, index) => (
                <div key={index}>
                  <div>
                    <Text
                      variant="medium"
                      color="foreground"
                      className="ui-banshee-font-medium"
                    >
                      {doc.name}
                    </Text>
                    <Text
                      variant="small"
                      color="muted"
                      className="ui-banshee-mt-1"
                    >
                      {doc.type}, {doc.size}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-banshee-bg-neutral-1 ui-banshee-p-6 ui-banshee-h-full">
            <Form {...form}>
              <div className="ui-banshee-grid ui-banshee-grid-cols-2 ui-banshee-gap-6 ui-banshee-mb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Text variant="small" color="foreground">
                        Name
                      </Text>
                      <Text variant="small" color="foreground">
                        {field.value}
                      </Text>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Text variant="small" color="foreground">
                        Email
                      </Text>
                      <Text variant="small" color="foreground">
                        {field.value}
                      </Text>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="ui-banshee-mb-4">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message..."
                        className="ui-banshee-w-full ui-banshee-min-h-[240px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Headline
                  as="h4"
                  variant="small"
                  color="foreground"
                  className="ui-banshee-mb-4 ui-banshee-border-b ui-banshee-border-gray-200"
                >
                  Attachments
                </Headline>
                <div className="ui-banshee-space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="ui-banshee-flex ui-banshee-items-center ui-banshee-border-b ui-banshee-border-gray-200 ui-banshee-justify-between ui-banshee-p-2 ui-banshee-bg-neutral-1 ui-banshee-rounded"
                    >
                      <Text variant="small" color="foreground">
                        {attachment.name} - {attachment.size}
                      </Text>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="ui-banshee-text-red-500 ui-banshee-transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="grey"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ui-banshee-pt-4 ui-banshee-flex ui-banshee-justify-between ui-banshee-items-center ui-banshee-border-t ui-banshee-border-neutral-3">
                <div className="ui-banshee-space-y-1">
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-text-blue-primary hover:ui-banshee-underline ui-banshee-cursor-pointer"
                  >
                    xCell@sandvik.com
                  </Text>
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-text-blue-primary hover:ui-banshee-underline ui-banshee-cursor-pointer"
                  >
                    localsupportexample@sandvik.com
                  </Text>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="ui-banshee-hidden"
                  onChange={handleAddAttachments}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleAttachFile}
                  type="button"
                  className="ui-banshee-flex-1 ui-banshee-max-w-[20%]"
                >
                  Attach file
                </Button>
              </div>

              <div className="ui-banshee-mt-16 ui-banshee-gap-4 ui-banshee-pt-4 ui-banshee-flex ui-banshee-justify-end">
                <Button
                  variant="primary"
                  size="small"
                  type="submit"
                  className="ui-banshee-flex-1 ui-banshee-max-w-[20%]"
                  onClick={form.handleSubmit(handleSendMessage)}
                >
                  Send message
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
