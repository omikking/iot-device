'use client';

import { SidebarInset } from '@gsp/ui-banshee';
import { Headline } from '@gsp/ui-banshee';
import { Text } from '@gsp/ui-banshee';
import { Textarea } from '@gsp/ui-banshee';
import { Button } from '@gsp/ui-banshee';
import { showAlertToast } from '@gsp/ui-banshee';
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
import { useSession } from 'next-auth/react';
import {
  ContactFormValues,
  contactFormSchema,
} from '@/components/schemas/ContactFormSchema';
import { useContactUs } from '@/libs/hooks/useContactUs';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Company } from '@/gql/graphql';

interface Attachment {
  id: string;
  name: string;
  size: string;
  file: File;
}

const getCompanyQuery = graphql(`
  query getCompany($id: String!) {
    company(id: $id) {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
      sandvikAdminUserId
      plans {
        id
        companyId
        applicationName
        planLevel
        expiringDate
      }
      users {
        id
        fullName
        phoneNumber
        email
      }
    }
  }
`);

// Mirrors the backend ALLOWED_ATTACHMENT_MIME_TYPES / limits so we can fail
// fast with a friendly message before hitting the API.
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ATTACHMENTS = 5;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
];
const FILE_ACCEPT = '.pdf,.png,.jpg,.jpeg,.csv';

export default function ContactUsPage({
  params,
}: {
  params: { companyId: string };
}) {
  const companyId = params.companyId;
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { submit, isSubmitting } = useContactUs(companyId);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    values: {
      name: session?.user?.fullName ?? '',
      email: session?.user?.email ?? '',
      message: '',
    },
  });

  const [companyData] = useQuery({
    query: getCompanyQuery,
    variables: { id: params.companyId },
  });
  const company = companyData?.data?.company as Company;

  const sandvikAdminUserInfo = company?.users?.find(
    (user) => user.id === company.sandvikAdminUserId,
  );

  const documents = [
    {
      name: 'xCell Cyclops Instruction Manual E V2.en',
      type: 'PDF document',
      size: '1276 kB',
      link: 'https://sandvik-my.sharepoint.com/:b:/p/amartya_srivastav_c/IQCVZI7RRl_1SYs104GspzalAX4mSe-oxYVYvZ28oKKnIrY?e=JJ7Jq2',
    },
    {
      name: 'xCell Cyclops System Overview E V2.en',
      type: 'PDF document',
      size: '1276 kB',
      link: 'https://sandvik-my.sharepoint.com/:b:/p/amartya_srivastav_c/IQCVZI7RRl_1SYs104GspzalAX4mSe-oxYVYvZ28oKKnIrY?e=JJ7Jq2',
    },
  ];

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleAttachFile = () => {
    inputRef.current?.click();
  };

  const handleSendMessage = async (values: ContactFormValues) => {
    await submit({
      message: values.message,
      attachments: attachments.map((att) => att.file),
      onSuccess: () => {
        form.reset({
          name: session?.user?.fullName ?? '',
          email: session?.user?.email ?? '',
          message: '',
        });
        setAttachments([]);
      },
    });
  };

  const handleAddAttachments = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const fileList = e.target.files;
    if (!fileList) return;

    const incoming: File[] = Array.from(fileList);

    const accepted: Attachment[] = [];
    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        showAlertToast({
          title: 'File too large',
          description: `"${file.name}" exceeds the 10MB limit.`,
          variant: 'error',
        });
        continue;
      }

      if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
        showAlertToast({
          title: 'Unsupported file type',
          description: `"${file.name}" is not an allowed file type.`,
          variant: 'error',
        });
        continue;
      }

      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        file,
      });
    }

    setAttachments((prev) => {
      const combined = [...prev, ...accepted];
      if (combined.length > MAX_ATTACHMENTS) {
        showAlertToast({
          title: 'Too many attachments',
          description: `You can attach up to ${MAX_ATTACHMENTS} files.`,
          variant: 'error',
        });
        return combined.slice(0, MAX_ATTACHMENTS);
      }
      return combined;
    });

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
          <div className="ui-banshee-bg-white ui-banshee-p-8">
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
                  <a
                    target="_blank"
                    href={doc.link}
                    download
                    className="ui-banshee-cursor-pointer ui-banshee-underline"
                  >
                    <Text variant="small" color="foreground">
                      {doc.name}
                    </Text>
                  </a>

                  <Text
                    variant="small"
                    color="muted"
                    className="ui-banshee-mt-1"
                  >
                    {doc.type}, {doc.size}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-banshee-bg-neutral-1 ui-banshee-p-8 ui-banshee-pr-16 ui-banshee-h-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)}>
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
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Headline
                    as="h5"
                    variant="base"
                    color="foreground"
                    className="ui-banshee-font-bold ui-banshee-pb-2 ui-banshee-border-b-2 ui-banshee-border-neutral-3"
                  >
                    Attachments
                  </Headline>
                  <div className="ui-banshee-space-y-2">
                    {attachments.length === 0 && (
                      <Text
                        variant="small"
                        color="muted"
                        className="ui-banshee-py-2"
                      >
                        No attachments added.
                      </Text>
                    )}
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="ui-banshee-flex ui-banshee-items-center ui-banshee-border-b ui-banshee-border-gray-200 ui-banshee-justify-between ui-banshee-p-2 ui-banshee-bg-neutral-1 ui-banshee-rounded !ui-banshee-m-0"
                      >
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-underline"
                        >
                          {attachment.name} - {attachment.size}
                        </Text>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting}
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
                      {sandvikAdminUserInfo?.email ||
                        'localsupportexample@sandvik.com'}
                    </Text>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={FILE_ACCEPT}
                    className="ui-banshee-hidden"
                    onChange={handleAddAttachments}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleAttachFile}
                    type="button"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="ui-banshee-flex-1 ui-banshee-max-w-[20%]"
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
