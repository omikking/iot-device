import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// A module that allows Apollo Client to communicate with a GraphQL server over HTTP.
const httpLink = new HttpLink({
  uri: `${process.env.BACKEND_URL}/graphql`,
});

// The core class of Apollo Client that manages interactions with the GraphQL server.
// InMemoryCache: A built-in cache implementation that Apollo Client uses to cache query results.
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
