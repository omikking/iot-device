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
  LoadingSpinner,
  showAlertToast,
} from '@gsp/ui-banshee';
import { Text } from '@gsp/ui-banshee';
import { CircleX, Menu } from 'lucide-react';
import { Button } from 'node_modules/@gsp/ui-banshee/src/components/base/button';
import { useRef, useState, useMemo, useEffect } from 'react';
import { SubmitOrderFormValues } from '@/components/schemas/SubmitOrderFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from 'node_modules/@gsp/ui-banshee/src/components/base/textarea';
import { Headline } from 'node_modules/@gsp/ui-banshee/src/components/base/headline';
import { useQuery, useMutation } from 'urql';
import { graphql } from '@/gql';
import { BansheeCartItemType } from '@/gql/graphql';
import { useParams } from 'next/navigation';
import { handleGraphQLErrors } from '@/libs/utils';

const cartItemsQuery = graphql(`
  query cartItems($companyId: String!) {
    cartItems(companyId: $companyId) {
      id
      itemType
      name
      quantity
      bansheeRequestId
      location {
        locationName
      }
      bansheeRequest {
        serialNumber
        location {
          locationName
        }
      }
    }
  }
`);

const submitOrderMutation = graphql(`
  mutation submitOrder($input: SubmitOrderInput!, $attachments: [Upload!]) {
    submitOrder(input: $input, attachments: $attachments) {
      id
    }
  }
`);

const deleteCartItemMutation = graphql(`
  mutation deleteCartItem($id: String!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`);

const updateNewBansheeCartItemMutation = graphql(`
  mutation updateNewBansheeCartItem(
    $companyId: String!
    $cartItemId: String!
    $input: UpdateNewBansheeCartItemInput!
  ) {
    updateNewBansheeCartItem(
      companyId: $companyId
      cartItemId: $cartItemId
      input: $input
    ) {
      id
      quantity
    }
  }
`);

interface Attachment {
  id: string;
  name: string;
  size: string;
  file: File;
}
export default function CartPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [
    { data, fetching: cartItemsFetching, error: cartItemsError },
    reexecuteCartItems,
  ] = useQuery({
    query: cartItemsQuery,
    variables: { companyId },
    requestPolicy: 'cache-and-network',
  });

  useEffect(() => {
    handleGraphQLErrors(cartItemsError);
  }, [cartItemsError]);
  const [{ fetching: submittingOrder }, executeSubmitOrder] =
    useMutation(submitOrderMutation);
  const [, executeDeleteCartItem] = useMutation(deleteCartItemMutation);
  const [, executeUpdateNewBansheeCartItem] = useMutation(
    updateNewBansheeCartItemMutation,
  );

  const [editedQuantities, setEditedQuantities] = useState<
    Record<string, string>
  >({});
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleQuantityChange = (cartItemId: string, value: string) => {
    setEditedQuantities((prev) => ({ ...prev, [cartItemId]: value }));

    if (debounceTimers.current[cartItemId]) {
      clearTimeout(debounceTimers.current[cartItemId]);
    }

    debounceTimers.current[cartItemId] = setTimeout(() => {
      const parsed = parseInt(value, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        executeUpdateNewBansheeCartItem({
          companyId,
          cartItemId,
          input: { quantity: parsed },
        }).then((result) => {
          if (handleGraphQLErrors(result.error)) return;
          if (result.error) {
            showAlertToast({
              title: 'Failed to update quantity',
              variant: 'error',
            });
            return;
          }
          showAlertToast({
            title: 'Quantity updated',
            variant: 'success',
          });
        });
      }
    }, 3000);
  };

  const cartItems = data?.cartItems ?? [];

  const newBansheeCount = useMemo(
    () =>
      cartItems
        .filter((item) => item.itemType === BansheeCartItemType.NewBanshee)
        .reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [cartItems],
  );
  const recurringCount = useMemo(
    () =>
      cartItems.filter(
        (item) => item.itemType === BansheeCartItemType.ServiceExisting,
      ).length,
    [cartItems],
  );
  const totalCount = newBansheeCount + recurringCount;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const form = useForm<SubmitOrderFormValues>({
    defaultValues: {
      orderComments: '',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<SubmitOrderFormValues> = async (values) => {
    const result = await executeSubmitOrder({
      input: {
        companyId,
        comment: values.orderComments ?? '',
        attachmentsName: attachments.map((a) => a.name),
      },
      // Actual files are sent outside of `input` as Upload scalars so the
      // backend can attach them to the order-details email.
      attachments: attachments.map((a) => a.file),
    });

    if (handleGraphQLErrors(result.error)) return;

    if (result.error) {
      showAlertToast({
        title: 'Failed to submit order',
        description: 'Please try again or contact support.',
        variant: 'error',
      });
      return;
    }

    showAlertToast({
      title: 'Order submitted successfully',
      variant: 'success',
    });

    form.reset({ orderComments: '' });
    setAttachments([]);
    reexecuteCartItems({ requestPolicy: 'network-only' });
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
  const handleDeleteCartItem = async (id: string) => {
    const result = await executeDeleteCartItem({ id });

    if (handleGraphQLErrors(result.error)) return;

    if (result.error) {
      showAlertToast({
        title: 'Failed to remove item',
        variant: 'error',
      });
      return;
    }

    showAlertToast({
      title: 'Item removed from cart',
      variant: 'success',
    });
  };
  const handleAddAttachmentButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <SidebarInset>
      <main className="ui-banshee-flex ui-banshee-flex-col ui-banshee-min-h-screen">
        <h1 className="ui-banshee-text-2xl ui-banshee-font-[500] ui-banshee-border-neutral-3 ui-banshee-border-b ui-banshee-w-full ui-banshee-p-6">
          Order Summary
        </h1>
        <div className="ui-banshee-flex ui-banshee-flex-wrap ui-banshee-h-full">
          <div className="ui-banshee-flex ui-banshee-h-[40vh] ui-banshee-flex-col ui-banshee-w-3/5 ui-banshee-p-7">
            <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-flex-1 ui-banshee-min-h-0">
              <Table variant="border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-1.5">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-font-semibold"
                      >
                        Item
                      </Text>
                    </TableHead>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-1.5">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-font-semibold"
                      >
                        Location
                      </Text>
                    </TableHead>
                    <TableHead className="!ui-banshee-text-left ui-banshee-px-3 ui-banshee-py-1.5">
                      <Text
                        variant="medium"
                        color="foreground"
                        className="ui-banshee-font-semibold ui-banshee-text-center"
                      >
                        Quantity
                      </Text>
                    </TableHead>
                    <TableHead className="ui-banshee-px-3 ui-banshee-py-1.5 ui-banshee-items-center">
                      <div className="ui-banshee-min-w-80 ui-banshee-w-full ui-banshee-flex ui-banshee-justify-end">
                        <Menu size={20} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItemsFetching && cartItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="ui-banshee-text-center ui-banshee-py-8"
                      >
                        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
                          <LoadingSpinner size={16} />
                          <Text variant="medium" color="muted">
                            Loading cart...
                          </Text>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!cartItemsFetching && cartItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="ui-banshee-text-center ui-banshee-py-4"
                      >
                        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
                          <Text variant="medium" color="muted">
                            Your cart is empty.
                          </Text>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {cartItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="ui-banshee-cursor-pointer"
                    >
                      <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3 ui-banshee-whitespace-nowrap">
                        <Text variant="medium" color="foreground">
                          {item.itemType === BansheeCartItemType.NewBanshee
                            ? item.name ?? '-'
                            : item.bansheeRequest?.serialNumber ?? '-'}
                        </Text>
                      </TableCell>
                      <TableCell className="!ui-banshee-text-left !ui-banshee-bg-neutral-1 ui-banshee-px-3 ui-banshee-whitespace-nowrap">
                        <Text variant="medium" color="foreground">
                          {item.itemType === BansheeCartItemType.NewBanshee
                            ? item?.location?.locationName ?? '-'
                            : item?.bansheeRequest?.location?.locationName ??
                              '-'}
                        </Text>
                      </TableCell>
                      <TableCell className="!ui-banshee-text-center !ui-banshee-bg-neutral-1 ui-banshee-px-3 ui-banshee-whitespace-nowrap">
                        {item.itemType === BansheeCartItemType.NewBanshee ? (
                          <input
                            type="number"
                            min={1}
                            value={
                              editedQuantities[item.id] ?? String(item.quantity)
                            }
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            style={{
                              MozAppearance: 'textfield',
                              WebkitAppearance: 'none',
                              appearance: 'textfield',
                            }}
                            className="ui-banshee-m-auto ui-banshee-w-10 ui-banshee-h-6 ui-banshee-rounded-md ui-banshee-border ui-banshee-border-input ui-banshee-bg-background ui-banshee-px-0 ui-banshee-text-md focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring ui-banshee-text-center [&::-webkit-inner-spin-button]:ui-banshee-appearance-none [&::-webkit-outer-spin-button]:ui-banshee-appearance-none [&::-webkit-inner-spin-button]:ui-banshee-m-0 [&::-webkit-outer-spin-button]:ui-banshee-m-0"
                          />
                        ) : (
                          <Text variant="medium" color="foreground">
                            {item.quantity}
                          </Text>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ width: '1%' }}
                        className="!ui-banshee-text-right ui-banshee-w-auto ui-banshee-px-3"
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteCartItem(item.id)}
                          aria-label="Remove cart item"
                          className="ui-banshee-flex ui-banshee-justify-end ui-banshee-items-center ui-banshee-w-full ui-banshee-cursor-pointer ui-banshee-bg-transparent ui-banshee-border-0 ui-banshee-py-0 ui-banshee-px-[.225rem]"
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

          <div className="ui-banshee-p-8 md:ui-banshee-p-10 md:ui-banshee-w-2/5 ui-banshee-bg-neutral-50">
            <div>
              <Headline
                as="h5"
                variant="base"
                color="foreground"
                className="ui-banshee-font-bold ui-banshee-pb-2 ui-banshee-border-b-2 ui-banshee-border-neutral-3"
              >
                Order Summary
              </Headline>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b  ui-banshee-w-full">
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  New Banshee Request
                </Text>
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  {newBansheeCount}
                </Text>
              </div>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b  ui-banshee-w-full">
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  Recurring Banshee Request
                </Text>
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  {recurringCount}
                </Text>
              </div>
              <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b ui-banshee-w-full">
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  Total Measurement Request
                </Text>
                <Text
                  variant="medium"
                  color="foreground"
                  className="ui-banshee-w-fit"
                >
                  {totalCount}
                </Text>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="lg:ui-banshee-col-span-5 ui-banshee-space-y-6 ui-banshee-mt-5">
                  <Headline
                    as="h6"
                    variant="base"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    Order Comments
                  </Headline>
                  <Textarea
                    style={{ height: '200px' }}
                    placeholder="Optional"
                    {...form.register('orderComments')}
                  />
                  <div>
                    {attachments.length !== 0 && (
                      <Headline
                        as="h5"
                        variant="base"
                        color="foreground"
                        className="ui-banshee-font-bold ui-banshee-pb-2 ui-banshee-border-b-2 ui-banshee-border-neutral-3"
                      >
                        Attachments
                      </Headline>
                    )}
                    <div className="ui-banshee-space-y-2">
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
                            variant="outline"
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
                  <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-flex-wrap ui-banshee-gap-4 ui-banshee-mt-10">
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
                    >
                      Attach file
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submittingOrder}
                    >
                      {submittingOrder && <LoadingSpinner size={16} />}
                      {submittingOrder ? 'Submitting...' : 'Submit Order'}
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
}
