'use client';

import { useCallback } from 'react';
import { useMutation } from 'urql';
import { showAlertToast } from '@gsp/ui-core';
import { graphql } from '@/gql';
import { handleGraphQLErrors } from '@/libs/utils';

const bansheeContactUsMutation = graphql(`
  mutation bansheeContactUs(
    $input: BansheeContactUsInput!
    $attachments: [Upload!]
  ) {
    bansheeContactUs(input: $input, attachments: $attachments) {
      success
      message
    }
  }
`);

export interface ContactUsParams {
  message: string;
  attachments: File[];
  onSuccess?: () => void;
}

/**
 * Encapsulates the Contact Us flow: sends the message together with any
 * attachments to the `bansheeContactUs` mutation (backend persists the request,
 * emails support with the files attached and tracks delivery status) and
 * surfaces success/error toasts. Mirrors {@link useSharePlotList}.
 */
export function useContactUs(companyId: string) {
  const [{ fetching: isSubmitting }, contactUs] = useMutation(
    bansheeContactUsMutation,
  );

  const submit = useCallback(
    async ({ message, attachments, onSuccess }: ContactUsParams) => {
      const result = await contactUs({
        input: { companyId, message },
        attachments,
      }).catch(() => null);

      if (handleGraphQLErrors(result?.error)) return;

      if (!result || result.error || !result.data?.bansheeContactUs?.success) {
        showAlertToast({
          title: 'Failed to send message',
          description: 'Please try again or contact support.',
          variant: 'error',
        });
        return;
      }

      onSuccess?.();
      showAlertToast({
        title: 'Message sent',
        description: 'Our support team will get back to you shortly.',
        variant: 'success',
      });
    },
    [companyId, contactUs],
  );

  return { submit, isSubmitting };
}
