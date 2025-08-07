import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppPlan } from '@/components/AppPlan';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { Application, Plan, PlanLevel } from '@/gql/graphql';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';
import { formattedDate, getAppName } from '@/libs/utils';
import { SandvikLogo } from 'public/SandvikLogo';

type AppPlansContainerProps = {
  appPlan: Plan;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
  isUserSandvikAdmin: boolean;
};

export const AppPlansContainer = ({
  appPlan,
  isUserSandvikAdmin,
  companyForm,
}: AppPlansContainerProps) => {
  const {
    applicationName,
    expiringDate,
    planLevel: initialPlanLevel,
  } = appPlan as Plan;

  const [activePlanLevel, setActivePlanLevel] = useState<PlanLevel | undefined>(
    initialPlanLevel as PlanLevel,
  );

  const [date, setDate] = useState<Date | number>(expiringDate);

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
        <div className="flex items-center gap-3">
          <SandvikLogo />
          <Headline variant="small" color="foreground" as="h3" isBold>
            {getAppName(applicationName as Application)}
          </Headline>
        </div>

        {isUserSandvikAdmin && activePlanLevel && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}

        {!isUserSandvikAdmin && !activePlanLevel && (
          <Badge variant="primary">
            <LucideSparkles size="14" />
            Available plans
          </Badge>
        )}
      </div>

      {/* Plan levels */}
      <AppPlan
        planLevel={PlanLevel.Gold}
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isUserSandvikAdmin={isUserSandvikAdmin}
      />
      <AppPlan
        planLevel={PlanLevel.Silver}
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isUserSandvikAdmin={isUserSandvikAdmin}
      />
      <AppPlan
        planLevel={PlanLevel.Bronze}
        companyForm={companyForm}
        appPlan={appPlan}
        expiringDate={date}
        activePlanLevel={activePlanLevel}
        onPlanLevelChange={setActivePlanLevel}
        isUserSandvikAdmin={isUserSandvikAdmin}
      />

      {/* Calendar */}
      {activePlanLevel && (
        <>
          {/* For Superadmin, always show */}
          {isUserSandvikAdmin && (
            <div className="py-5 px-6 border-b border-neutral-2">
              <FormLabel>Expiring date</FormLabel>
              <SingleDateCalendar
                className="mt-2"
                selectedDate={expiringDate}
                onDateChange={handleDateChange}
              />
            </div>
          )}

          {!isUserSandvikAdmin && date !== 0 && date !== null && (
            <div className="py-5 px-6 border-b border-neutral-2">
              <Badge variant="primary">
                <LucideCalendar size="14" />
                Your plan expires {formattedDate(date)}
              </Badge>
            </div>
          )}
        </>
      )}
    </div>
  );
};
