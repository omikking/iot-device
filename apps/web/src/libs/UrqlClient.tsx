'use client';

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

// This client manages all of our GraphQL requests and results.
const client = new Client({
  //url: 'process.env.NEXT_PUBLIC_GRAPHQL_URL', I think this is the way to go
  url: 'http://localhost:3333/graphql',
  exchanges: [cacheExchange, fetchExchange],
  // TODO: We will get the access token from NextAuth here and add it to the headers
  // fetchOptions: () => {
  //   return {
  //     headers: {
  //       Authorization
  //     },
  //   };
  // }
});

export const UrqlWrapper = ({ children }: React.PropsWithChildren) => (
  <Provider value={client}>{children}</Provider>
);
