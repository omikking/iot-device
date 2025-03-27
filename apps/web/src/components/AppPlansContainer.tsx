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
export const formattedDate = (timestamp: Date | number) => {
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
    expiringDate,
    planLevel: initialPlanLevel,
  } = appPlan as Plan;

  const [activePlanLevel, setActivePlanLevel] = useState<PlanLevel | undefined>(
    initialPlanLevel as PlanLevel,
  );

  const [date, setDate] = useState<Date | number | undefined>(expiringDate);

  const handleDateChange = (date?: Date) => {
    const currentPlans = (companyForm.getValues('plans') as Plan[]) || [];

    const updatedPlans = currentPlans.map((plan) => {
      if (plan.applicationName === applicationName) {
        return {
          ...appPlan,
          planLevel: activePlanLevel,
          expiringDate: date?.getTime() || 0,
        };
      }
      return plan;
    });

    companyForm.setValue('plans', updatedPlans as Plan[], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setDate(date?.getTime() || 0);
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

        {user === 'Superadmin' && activePlanLevel && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}

        {user === 'Client' && !activePlanLevel && (
          <Badge variant="primary">
            <LucideSparkles size="14" />
            Available plans
          </Badge>
        )}
      </div>

      {/* Plan levels */}
      <AppPlan
        planLevel="GOLD"
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isAdmin={isAdmin}
      />
      <AppPlan
        planLevel="SILVER"
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isAdmin={isAdmin}
      />
      <AppPlan
        planLevel="BRONZE"
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isAdmin={isAdmin}
      />

      {/* Calendar */}
      {activePlanLevel && (
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
                selectedDate={expiringDate}
                onDateChange={handleDateChange}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
