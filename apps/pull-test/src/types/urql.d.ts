/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import {
  AnyVariables,
  OperationContext,
  RequestPolicy,
  UseQueryResponse,
} from 'urql';
import type { DocumentNode } from 'graphql';
declare module 'urql' {
  // @ts-expect-error this is just temporary until we update types in urql
  export type UseQueryArgs<
    Variables extends AnyVariables = AnyVariables,
    Data = any,
  > = {
    query: string | DocumentNode | DocumentTypeDecoration<Data, Variables>;
    requestPolicy?: RequestPolicy;
    context?: Partial<OperationContext>;
    pause?: boolean;
  } & (Variables extends void
    ? {
        variables?: Variables;
      }
    : Variables extends {
          [P in keyof Variables]: Variables[P] | null;
        }
      ? {
          variables?: Variables;
        }
      : {
          variables: Variables;
        });

  export function useQuery<
    Data = any,
    Variables extends AnyVariables = AnyVariables,
  >(args: UseQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables>;
}
