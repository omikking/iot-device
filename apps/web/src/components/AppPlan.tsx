'use client';
import {
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';
import { Plan, PlanLevel } from '@/gql/graphql';
import { capitalizeFirstLetter } from '@/libs/utils';

type AppPlanProps = {
  appPlan: Plan;
  planLevel: PlanLevel;
  isAdmin: boolean;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
  activePlanLevel?: PlanLevel;
  expiringDate?: Date | number;
  onPlanLevelChange: (planLevel?: PlanLevel) => void;
};

export const AppPlan = ({
  appPlan,
  planLevel,
  activePlanLevel,
  isAdmin,
  companyForm,
  expiringDate,
  onPlanLevelChange,
}: AppPlanProps) => {
  const userRole = isAdmin ? 'Superadmin' : 'Client';
  const isPlanActive = planLevel === activePlanLevel;

  const { applicationName } = appPlan;

  const handlePlanChange = (isChecked: boolean) => {
    const newPlanLevel = isChecked ? planLevel : undefined;
    const currentPlans = companyForm.getValues('plans') || [];
    let updatedPlans;

    const existingPlan = currentPlans.findIndex(
      (planItem) => planItem.applicationName === applicationName,
    );

    if (isChecked) {
      // Update existing plan
      if (existingPlan >= 0) {
        updatedPlans = currentPlans.map((planItem) => {
          if (planItem.applicationName === applicationName) {
            return { ...appPlan, planLevel, expiringDate };
          }
          return planItem;
        });
        // Add new plan
      } else {
        updatedPlans = [
          ...currentPlans,
          {
            ...appPlan,
            planLevel,
            expiringDate,
          },
        ];
      }
      // If switch is unchecked, remove plan
    } else {
      updatedPlans = currentPlans.filter(
        (planItem) => planItem.applicationName !== applicationName,
      );
    }

    onPlanLevelChange(newPlanLevel);

    companyForm.setValue('plans', updatedPlans as Plan[], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div
      className={`flex justify-between items-center h-14 border-b border-gray-200 py-3 px-6 ${
        isPlanActive ? 'bg-neutral-1' : ''
      }`}
    >
      <FormField
        control={companyForm.control}
        name="plans"
        render={() => (
          <FormItem className="flex w-full justify-between items-center">
            <FormLabel
              className="flex items-center"
              variant="medium"
              color="foreground"
            >
              {capitalizeFirstLetter(planLevel)}
            </FormLabel>

            {userRole === 'Superadmin' && (
              <FormControl>
                <Switch
                  checked={activePlanLevel === planLevel}
                  onCheckedChange={handlePlanChange}
                />
              </FormControl>
            )}

            {userRole === 'Client' && isPlanActive && (
              <Badge variant="attention" className="flex items-center">
                <LucideCircleCheckBig size="16" className="mr-1" />
                Your selected plan
              </Badge>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};
