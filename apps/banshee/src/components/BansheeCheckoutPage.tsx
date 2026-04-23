'use client';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SidebarInset,
  Form,
} from '@gsp/ui-banshee';
import { Text } from '@gsp/ui-banshee';
import { CircleX, Menu } from 'lucide-react';
import { Button } from 'node_modules/@gsp/ui-banshee/src/components/base/button';
import { FormField } from './FormField';
import { useRef, useState } from 'react';
import { SubmitOrderFormValues } from '@/components/schemas/SubmitOrderFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from 'node_modules/@gsp/ui-banshee/src/components/base/textarea';
import { Headline } from 'node_modules/@gsp/ui-banshee/src/components/base/headline';

interface Attachment {
  id: string;
  name: string;
  size: string;
}
export const BansheeCheckoutPage = () => {
  const PLACEHOLDER_ORDERS = [
    { id: 1, item: 'New Banshee', location: 'New Location 1', qty: 10 },
    { id: 2, item: 'New Banshee', location: 'New Location 2', qty: 10 },
    { id: 3, item: 'New Banshee', location: 'New Location 3', qty: 10 },
    { id: 4, item: '100000 06', location: 'P4039-ACC-left', qty: 1 },
    { id: 5, item: '100000 10', location: 'P4039-ACC-right', qty: 1 },
    { id: 6, item: '100000 08', location: 'P4039-ACC-right', qty: 1 },
    { id: 7, item: '100000 11', location: 'P3940-XC2', qty: 1 },
    { id: 8, item: '100000 12', location: 'P3940-XC2', qty: 1 },
    { id: 9, item: '100000 13', location: 'P3940-XC2', qty: 1 },
    { id: 10, item: '100000 14', location: 'P3940-XC2', qty: 1 },
    { id: 11, item: '100000 15', location: 'P3940-XC2', qty: 1 },
    { id: 12, item: '100000 07', location: 'P4039-ACC-right', qty: 1 },
    { id: 13, item: '100000 09', location: 'P4039-ACC-right', qty: 1 },
    { id: 14, item: '100000 21', location: 'P3940-XC4', qty: 1 },
    { id: 15, item: '100000 22', location: 'P3940-XC4', qty: 1 },
    { id: 16, item: '100000 03', location: 'P4039-ACC-left', qty: 1 },
    { id: 17, item: '100000 04', location: 'P4039-ACC-left', qty: 1 },
  ];
  type Order = {
    id: number;
    item: string;
    location: string;
    qty: number;
  };
  const [orders, setOrders] = useState<Order[]>(PLACEHOLDER_ORDERS);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: '1', name: 'File name', size: 'size kb' },
    { id: '2', name: 'File name', size: 'size kb' },
  ]);
  const form = useForm<SubmitOrderFormValues>({
    defaultValues: {
      orderComments: '',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) => {
    setOrders((prev) => prev.filter((row) => row.id !== id));
  };

  const onSubmit: SubmitHandler<SubmitOrderFormValues> = async (values) => {
    console.log(values);
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

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };
  const handleAddAttachmentButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <SidebarInset>
      <main className="ui-banshee-flex ui-banshee-gap-5 ui-banshee-flex-col ui-banshee-min-h-screen">
        <h1 className="ui-banshee-text-2xl ui-banshee-font-bold ui-banshee-border-[#DADADA] ui-banshee-border-b ui-banshee-w-full ui-banshee-p-6">
          Order Summary
        </h1>
        <div className="ui-banshee-flex ui-banshee-flex-wrap ui-banshee-h-full">
          <div className="ui-banshee-flex ui-banshee-h-[40vh] ui-banshee-flex-col ui-banshee-w-3/5 ui-banshee-p-3">
            <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-flex-1 ui-banshee-min-h-0">
              <Table variant="border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2">
                      <Text
                        variant="small"
                        color="foreground"
                        className="ui-banshee-font-semibold"
                      >
                        Item
                      </Text>
                    </TableHead>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2">
                      <Text
                        variant="small"
                        color="foreground"
                        className="ui-banshee-font-semibold"
                      >
                        Location
                      </Text>
                    </TableHead>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-2">
                      <Text
                        variant="small"
                        color="foreground"
                        className="ui-banshee-font-semibold"
                      >
                        Quantity
                      </Text>
                    </TableHead>
                    <TableHead className="ui-banshee-justify-center !ui-banshee-align-center ui-banshee-w-auto ui-banshee-px-3 ui-banshee-py-2">
                      <Menu size={20} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="ui-banshee-cursor-pointer"
                    >
                      <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3">
                        <Text variant="small" color="foreground">
                          {order?.item}
                        </Text>
                      </TableCell>
                      <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3">
                        <Text variant="small" color="foreground">
                          {order?.location}
                        </Text>
                      </TableCell>
                      <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3">
                        <Text variant="small" color="foreground">
                          {order?.qty}
                        </Text>
                      </TableCell>
                      <TableCell
                        style={{ width: '1%' }}
                        className="!ui-banshee-text-right ui-banshee-w-auto ui-banshee-px-3"
                      >
                        <button
                          type="button"
                          onClick={() => handleDelete(order.id)}
                          className="ui-banshee-text-neutral-400 hover:ui-banshee-text-red-500 ui-banshee-transition-colors ui-banshee-flex ui-banshee-m-auto"
                        >
                          <CircleX size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="ui-banshee-p-6 md:ui-banshee-p-10 md:ui-banshee-w-2/5 ui-banshee-bg-neutral-50">
            <div>
              <Headline
                as="h4"
                variant="small"
                color="foreground"
                className="ui-banshee-mb-4 ui-banshee-border-b ui-banshee-border-gray-200"
              >
                Order Summary
              </Headline>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b  ui-banshee-w-full">
                <p className="ui-banshee-w-fit ui-banshee-text-[.825rem]">
                  New Banshee Request
                </p>
                <p className="ui-banshee-w-fit  ui-banshee-text-[.825rem]">
                  20
                </p>
              </div>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b  ui-banshee-w-full">
                <p className="ui-banshee-w-fit ui-banshee-text-[.825rem]">
                  Recurring Banshee Request
                </p>
                <p className="ui-banshee-w-fit ui-banshee-text-[.825rem]">
                  130
                </p>
              </div>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b ui-banshee-w-full">
                <p className="ui-banshee-w-fit ui-banshee-text-[.825rem]">
                  Total Measurement Request
                </p>
                <p className="ui-banshee-w-fit ui-banshee-text-[.825rem]">
                  150
                </p>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="lg:ui-banshee-col-span-5 ui-banshee-space-y-6 ui-banshee-mt-5">
                  <FormField label="Order Comments">
                    <Textarea
                      style={{ height: '200px' }}
                      placeholder="Optional"
                      {...form.register('orderComments')}
                    />
                  </FormField>
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
                            onClick={() =>
                              handleRemoveAttachment(attachment.id)
                            }
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
                  <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-gap-4 ui-banshee-mt-10">
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
                      onClick={handleAddAttachmentButtonClick}
                      type="button"
                      className="ui-banshee-flex-1 ui-banshee-max-w-[20%]"
                    >
                      Attach file
                    </Button>
                    <Button variant="primary" type="submit">
                      Submit Order
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </SidebarInset>
  );
};
