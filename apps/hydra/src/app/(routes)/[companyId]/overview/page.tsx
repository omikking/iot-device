'use client';

import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { Headline, Text, LoadingSpinner, SidebarInset } from '@gsp/ui-core';
import { handleGraphQLErrors } from '@/libs/utils';

const CompanyOverviewQuery = graphql(`
  query hydraCompanyOverview($id: String!) {
    company(id: $id) {
      id
      name
      city
      country
    }
  }
`);

export default function OverviewPage({
  params,
}: {
  params: { companyId: string };
}) {
  const [{ data, fetching, error }] = useQuery({
    query: CompanyOverviewQuery,
    variables: { id: params.companyId },
  });

  handleGraphQLErrors(error);

  const company = data?.company;

  return (
    <SidebarInset>
      <main className="flex flex-1 flex-col gap-8 bg-neutral-1 p-10">
        <Headline as="h1" variant="large" color="foreground" isBold>
          Hydra
        </Headline>

        {fetching && <LoadingSpinner size={24} />}

        {company && (
          <div className="flex flex-col gap-2">
            <Headline as="h2" variant="medium" color="foreground">
              {company.name}
            </Headline>
            <Text variant="medium" color="muted">
              {[company.city, company.country].filter(Boolean).join(', ')}
            </Text>
            <Text variant="small" color="muted">
              Company ID: {company.id}
            </Text>
          </div>
        )}

        <Text variant="small" color="muted">
          This is a placeholder page. Auth, routing, urql and the design
          system are wired up — build features from here.
        </Text>
      </main>
    </SidebarInset>
  );
}
