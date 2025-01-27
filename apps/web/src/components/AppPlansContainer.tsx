import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { useState } from 'react';
import { AppPlan } from '@/components/AppPlan';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from './schemas/CompanyFormSchema';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';

const getFormFieldName = (name: string) => {
  switch (name) {
    case 'PULL_TEST':
      return 'pullTestPlan';
    case 'XCYCLOPS':
      return 'xCyclopsPlan';
    case 'ULTRABOLTS':
      return 'ultraboltsPlan';
    default:
      return undefined;
  }
};

interface AppPlansContainerProps {
  appPlan: {
    id: string;
    applicationName: string;
    planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
  };
  isAdmin: boolean;
  companyForm: UseFormReturn<CompanyFormValues>;
}

export const AppPlansContainer = ({
  appPlan,
  isAdmin,
  companyForm,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());
  const { applicationName, planLevel: initialActivePlan } = appPlan;
  const [activePlan, setActivePlan] = useState<
    'GOLD' | 'SILVER' | 'BRONZE' | undefined
  >(initialActivePlan);

  const user = isAdmin ? 'Superadmin' : 'Client';
  const formField = getFormFieldName(applicationName) || '';

  // export to a utility file?
  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const handlePlanChange = (plan: 'GOLD' | 'SILVER' | 'BRONZE' | undefined) => {
    setActivePlan(plan);
  };

  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="small" color="foreground" as="h3" isBold>
          {toTitleCase(applicationName.replace('_', ' '))}
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
        formField={formField}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="SILVER"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="BRONZE"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
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
              {/* @TODO Do we want to have it as disabled or invisible when plan is not selected? */}
              {/* <SingleDateCalendar disabled={activePlan} className="mt-2" /> */}
              <SingleDateCalendar className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
