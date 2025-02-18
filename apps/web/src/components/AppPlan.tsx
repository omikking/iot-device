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
import { Company } from '@/gql/graphql';
import { PlanLevel } from '@/app/mock/mock';

// @TODO put in a utils folder
export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

interface AppPlanProps {
  plan: PlanLevel;
  activePlan?: PlanLevel;
  isAdmin: boolean;
  // companyForm: UseFormReturn<CreateCompanyInput | UpdateCompanyInput>;
  companyForm: UseFormReturn<Company>;
  applicationName: string;
  onPlanChange: (plan: PlanLevel) => void;
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({
  plan,
  activePlan,
  isAdmin,
  companyForm,
  applicationName,
  onPlanChange,
}: AppPlanProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';
  const isActive = plan === activePlan;

  // @TODO Updating app not working atm. Fix it.
  return (
    <div
      className={`flex justify-between items-center h-14 border-b border-gray-200 py-3 px-6 ${
        isActive ? 'bg-neutral-1' : ''
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

            {user === 'Superadmin' && (
              <FormControl>
                <Switch
                  checked={activePlan === plan}
                  onCheckedChange={(checked) => {
                    const newPlan = checked ? plan : undefined;
                    // AI Generated Code
                    const currentPlans = field.value || [];
                    const existingPlanIndex = currentPlans.findIndex(
                      (p) => p.applicationName === applicationName,
                    );
                    let updatedPlans;
                    if (checked) {
                      // If checking the switch, update or add the plan
                      if (existingPlanIndex >= 0) {
                        // Update existing plan
                        updatedPlans = currentPlans.map((p, index) =>
                          index === existingPlanIndex
                            ? { ...p, planLevel: plan }
                            : p,
                        );
                      } else {
                        // Add new plan
                        updatedPlans = [
                          ...currentPlans,
                          {
                            applicationName,
                            planLevel: plan,
                          },
                        ];
                      }
                    } else {
                      // If unchecking, remove the plan
                      updatedPlans = currentPlans.filter(
                        (p) => p.applicationName !== applicationName,
                      );
                    }
                    // AI generated code ends
                    field.onChange(updatedPlans);
                    onPlanChange(newPlan as PlanLevel);
                  }}
                />
              </FormControl>
            )}

            {user === 'Client' && isActive && (
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
