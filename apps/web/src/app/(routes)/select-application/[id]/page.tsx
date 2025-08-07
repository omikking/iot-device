'use client';
import { useQuery } from 'urql';
import { Badge, Headline, NavigationCard } from '@gsp/ui';
import { GoBack } from '@/components/GoBack';
import { SandvikLogo } from 'public/SandvikLogo';
import Link from 'next/link';
import { LucideCircuitBoard } from 'lucide-react';
import { graphql } from '@/gql';
import { getAppName } from '@/libs/utils';
import { Application, Plan, Role } from '@/gql/graphql';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

const getCompanyPlansQuery = graphql(`
  query getCompanyPlans($id: String!) {
    company(id: $id) {
      id
      name
      plans {
        id
        applicationName
        planLevel
        expiringDate
      }
    }
  }
`);

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const { data: session } = useSession();

  const displayPlans = (
    companyPlans: Plan[] | undefined,
    companyId: string,
    user?: Session['user'],
  ): Application[] => {
    if (!companyPlans || companyPlans.length === 0) {
      return [];
    }

    const userPermission = user?.userPermissions?.find(
      (permission) => permission.companyId === companyId,
    );

    const allPlansForAdmin =
      userPermission?.role === Role.CompanyAdmin ||
      user?.globalRole === Role.SandvikAdmin;

    const userAppsAccess = userPermission?.appsAccess || [];
    const currentDate = new Date();

    return companyPlans
      .filter((plan) => {
        if (!plan.planLevel) {
          return false;
        }
        if (plan.expiringDate) {
          const expiryDate = new Date(plan.expiringDate);
          if (expiryDate < currentDate) {
            return false;
          }
        }
        return (
          allPlansForAdmin || userAppsAccess.includes(plan.applicationName)
        );
      })
      .map((plan) => plan.applicationName) as Application[];
  };

  const user = session?.user;
  const companyId = params.id;

  const [companyResult] = useQuery({
    query: getCompanyPlansQuery,
    variables: { id: companyId },
  });

  const companyName = companyResult.data?.company?.name;
  const companyPlans = companyResult?.data?.company.plans as Plan[];

  // Get filtered plans based on user permissions
  const availableApps = displayPlans(companyPlans, companyId, user);

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-1 overflow-y-auto">
      <GoBack />

      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Select Application
      </Headline>

      {availableApps.length > 0 && (
        <div className="flex flex-row justify-center gap-10 max-w-[1000px] w-full pt-20 border-t border-t-neutral-2">
          {availableApps.map((plan, index) => (
            <div className="flex flex-row gap-12 justify-center" key={index}>
              <Link href={`http://localhost:3001/overview/${companyId}`}>
                <NavigationCard size="small">
                  <Headline
                    as="h3"
                    variant="medium"
                    color="foreground"
                    isBold
                    className="text-center"
                  >
                    {getAppName(plan)}
                  </Headline>
                  <SandvikLogo width="32" height="32" />
                </NavigationCard>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row justify-around gap-10 max-w-[1000px] w-full pt-20 border-t border-t-neutral-2">
        <div className="flex flex-row gap-12 w-full justify-center">
          <Link href={`/company/${companyId}`}>
            <NavigationCard size={'medium'}>
              <Headline as="h3" variant="medium" color="foreground">
                Administration Portal
              </Headline>
              <LucideCircuitBoard size={40} />
            </NavigationCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
