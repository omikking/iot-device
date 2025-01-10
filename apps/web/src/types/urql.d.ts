/* eslint-disable @typescript-eslint/no-explicit-any */

// This exists here since neither the official graphql-codegen urql setup guide or urql graphql-codegen setup guide don't mention that they are both broken and don't work.
// I had to clone the graphql-codegen repo, look up the example code they used to write their setup docs, setup their project only to find out that theirs also has the same broken typing issue.
// But hey, at least the codebase had this fix in it, that not mentioned anywhere else and has been there as a "temp" fix for 2 years now. NOOooo, I'm not salty at all :)

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
