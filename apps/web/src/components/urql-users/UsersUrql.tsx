import React from 'react';
import { cacheExchange, createClient, fetchExchange } from 'urql/core';
import { graphql } from '@/gql';
import { registerUrql } from '@urql/next/rsc';

const getUsersQuery = graphql(`
  query getUsers {
    users {
      id
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
      userPermissions {
        id
        role
        appsAccess
      }
    }
  }
`);

const makeClient = () => {
  return createClient({
    url: 'http://localhost:3333/graphql',
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: { cache: 'no-store' },
  });
};

const { getClient } = registerUrql(makeClient);

export default async function UsersUrql() {
  const result = await getClient().query(getUsersQuery, {});
  if (result.error) return <p>Error</p>;

  console.log(result.data?.users);
}
