'use client';

import { gql, useQuery } from 'urql';
import { useEffect, useState } from 'react';

const getProceqLoginUrlQuery = gql`
  query getProceqLoginUrl($callbackUrl: String!) {
    proceqLoginUrl(callbackUrl: $callbackUrl) {
      url
    }
  }
`;

export function ConnectProceqButton() {
  const [callbackUrl, setCallbackUrl] = useState(null);

  const [result] = useQuery({
    query: getProceqLoginUrlQuery,
    variables: { callbackUrl },
    pause: !callbackUrl,
  });

  function handleConnectProceq() {
    setCallbackUrl(window.location.href);
  }

  useEffect(() => {
    const url = result.data?.proceqLoginUrl?.url;

    if (url) {
      window.location.href = url;
    }
  }, [result.data]);

  return <button onClick={handleConnectProceq}>Click me</button>;
}
