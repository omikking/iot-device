'use client';

import { useCallback } from 'react';
import { useMutation } from 'urql';
import { showAlertToast } from '@gsp/ui-core';
import { graphql } from '@/gql';
import {
  buildBansheeCsvFile,
  handleGraphQLErrors,
  type BansheeCsvRow,
} from '@/libs/utils';

const bansheeSharePlotListMutation = graphql(`
  mutation bansheeSharePlotList(
    $input: BansheeSharePlotListInput!
    $image: Upload!
    $csv: Upload!
  ) {
    bansheeSharePlotList(input: $input, image: $image, csv: $csv) {
      success
      sentTo
      message
    }
  }
`);

export interface SharePlotParams {
  email: string;
  rows: readonly BansheeCsvRow[];
  pngFile: File | undefined;
  onSuccess?: () => void;
}

/**
 * Encapsulates the Share Plot List flow: builds a CSV file from the provided
 * rows, sends it together with the graph PNG to the `bansheeSharePlotList`
 * mutation (backend turns them into a PDF and emails it), and surfaces
 * success/error toasts. Shared by the banshee list and dashboard pages.
 */
export function useSharePlotList(companyId: string) {
  const [, sharePlotList] = useMutation(bansheeSharePlotListMutation);

  return useCallback(
    async ({ email, rows, pngFile, onSuccess }: SharePlotParams) => {
      if (!rows.length) {
        showAlertToast({
          title: 'Nothing to share',
          description: 'There is no plot data available to share.',
          variant: 'error',
        });
        return;
      }
      if (!pngFile) {
        showAlertToast({
          title: 'Could not capture graph',
          description: 'Please wait for the graph to render and try again.',
          variant: 'error',
        });
        return;
      }

      const csvFile = buildBansheeCsvFile(rows);
      const result = await sharePlotList({
        input: { companyId, recipientEmail: email },
        image: pngFile,
        csv: csvFile,
      }).catch(() => null);

      if (handleGraphQLErrors(result?.error)) return;

      if (
        !result ||
        result.error ||
        !result.data?.bansheeSharePlotList?.success
      ) {
        showAlertToast({
          title: 'Failed to share plot list',
          description: 'Please try again or contact support.',
          variant: 'error',
        });
        return;
      }

      onSuccess?.();
      showAlertToast({
        title: 'Plot list shared successfully',
        description: `A report has been emailed to ${email}.`,
        variant: 'success',
      });
    },
    [companyId, sharePlotList],
  );
}
