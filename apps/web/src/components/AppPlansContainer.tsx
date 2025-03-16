import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppPlan } from '@/components/AppPlan';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { Plan } from '@/gql/graphql';
import { PlanLevel } from '@/app/mock/mock';
import { formatAppName } from './UsersTable';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';

// @TODO move to utils?
export const formattedDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

interface AppPlansContainerProps {
  appPlan: Plan;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
  isAdmin: boolean;
}

export const AppPlansContainer = ({
  appPlan,
  isAdmin,
  companyForm,
}: AppPlansContainerProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';

  const {
    applicationName,
    planLevel: initialPlanLevel,
    expiringDate,
  } = appPlan;

  const [activePlan, setActivePlan] = useState<PlanLevel | undefined>(
    initialPlanLevel as PlanLevel,
  );

  const [date, setDate] = useState<Date | undefined>(expiringDate);

  const handleDateChange = (date?: Date) => {
    // @TODO is this how we should do to update the date etc?
    const currentPlans = companyForm.getValues('plans') || [];

    const updatedPlans = currentPlans.map((plan) => {
      if (plan.applicationName === applicationName) {
        return { ...plan, expiringDate: date?.getTime() };
      }
      return plan;
    });

    companyForm.setValue('plans', updatedPlans);
    setDate(date);
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
        onPlanChange={setActivePlan}
      />
      <AppPlan
        plan="SILVER"
        activePlan={activePlan}
        isAdmin={isAdmin}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={setActivePlan}
      />
      <AppPlan
        plan="BRONZE"
        activePlan={activePlan}
        isAdmin={isAdmin}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={setActivePlan}
      />

      {/* Calendar */}
      {activePlan && (
        <div className="py-5 px-6 border-b border-neutral-2">
          {user === 'Client' && date && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires {formattedDate(date)}
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              <SingleDateCalendar
                className="mt-2"
                selectedDate={date}
                onDateChange={handleDateChange}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
