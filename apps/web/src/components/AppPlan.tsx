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
import { PlanLevel } from '@/app/mock/mock';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';
import { Plan } from '@/gql/graphql';

// @TODO put in a utils folder
export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

interface AppPlanProps {
  plan: PlanLevel;
  applicationName: string;
  isAdmin: boolean;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
  activePlan?: PlanLevel;
  onPlanChange: (plan?: PlanLevel) => void;
}

export const AppPlan = ({
  plan,
  activePlan,
  isAdmin,
  companyForm,
  applicationName,
  onPlanChange,
}: AppPlanProps) => {
  const userRole = isAdmin ? 'Superadmin' : 'Client';
  const isPlanActive = plan === activePlan;

  // @TODO see if we could fix the field typing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlanChange = (isChecked: boolean, field: any) => {
    const newPlan = isChecked ? plan : undefined;
    const currentPlans = field.value || [];
    let updatedPlans;

    const existingPlan = currentPlans.findIndex(
      (planItem: Plan) => planItem.applicationName === applicationName,
    );

    if (isChecked) {
      // Update existing plan
      if (existingPlan >= 0) {
        updatedPlans = currentPlans.map((planItem: Plan, i: number) =>
          i === existingPlan ? { ...planItem, planLevel: plan } : planItem,
        );
        // Add new plan
      } else {
        updatedPlans = [
          ...currentPlans,
          {
            applicationName,
            planLevel: plan,
          },
        ];
      }
      // If switch is unchecked, remove plan
    } else {
      updatedPlans = currentPlans.filter(
        (planItem: Plan) => planItem.applicationName !== applicationName,
      );
    }

    field.onChange(updatedPlans);
    onPlanChange(newPlan);
  };

  // @TODO Updating app not working atm. Fix it.
  return (
    <div
      className={`flex justify-between items-center h-14 border-b border-gray-200 py-3 px-6 ${
        isPlanActive ? 'bg-neutral-1' : ''
      }`}
    >
      <FormField
        control={companyForm.control}
        name="plans"
        render={({ field }) => (
          <FormItem className="flex w-full justify-between items-center">
            <FormLabel
              className="flex items-center"
              variant="medium"
              color="foreground"
            >
              {capitalizeFirstLetter(plan)}
            </FormLabel>

            {userRole === 'Superadmin' && (
              <FormControl>
                <Switch
                  checked={activePlan === plan}
                  onCheckedChange={(isChecked) =>
                    handlePlanChange(isChecked, field)
                  }
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
