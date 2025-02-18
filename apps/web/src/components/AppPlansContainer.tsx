import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppPlan } from '@/components/AppPlan';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { CreateCompanyInput, Plan, UpdateCompanyInput } from '@/gql/graphql';
import { PlanLevel } from '@/app/mock/mock';
import { formatAppName } from './UsersTable';

interface AppPlansContainerProps {
  appPlan: Plan;
  companyForm: UseFormReturn<CreateCompanyInput | UpdateCompanyInput>;
  isAdmin: boolean;
}

export const AppPlansContainer = ({
  appPlan,
  isAdmin,
  companyForm,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());

  const { applicationName, planLevel: initialActivePlan } = appPlan as {
    applicationName: string;
    planLevel: PlanLevel;
  };
  const [activePlan, setActivePlan] = useState<PlanLevel>(initialActivePlan);
  const user = isAdmin ? 'Superadmin' : 'Client';

  const handlePlanChange = (plan: PlanLevel) => {
    setActivePlan(plan);
  };

  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="small" color="foreground" as="h3" isBold>
          {formatAppName(applicationName)}
        </Headline>

        {user === 'Superadmin' && activePlan && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}

        {user === 'Client' && !activePlan && (
          <Badge variant="primary">
            <LucideSparkles size="14" />
            Available plans
          </Badge>
        )}
      </div>

      {/* Plans */}
      <AppPlan
        plan="GOLD"
        activePlan={activePlan}
        isAdmin={isAdmin}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="SILVER"
        activePlan={activePlan}
        isAdmin={isAdmin}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="BRONZE"
        activePlan={activePlan}
        isAdmin={isAdmin}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />

      {/* Calendar */}
      {activePlan && (
        <div className="py-5 px-6 border-b border-neutral-2">
          {user === 'Client' && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires 2025-08-10
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              <SingleDateCalendar className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
