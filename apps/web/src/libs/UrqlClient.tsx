'use client';

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

// This client manages all of our GraphQL requests and results.
const client = new Client({
  url: 'http://localhost:3333/graphql',
  exchanges: [cacheExchange, fetchExchange],
  // TODO: We will get the access token from NextAuth here and add it to the headers
});

export const UrqlWrapper = ({ children }: React.PropsWithChildren) => (
  <Provider value={client}>{children}</Provider>
);
