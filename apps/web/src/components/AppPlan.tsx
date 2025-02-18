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
import { CreateCompanyFormValues } from './schemas/CompanyFormSchema';

interface AppPlanProps {
  plan: 'GOLD' | 'SILVER' | 'BRONZE';
  activePlan?: 'GOLD' | 'SILVER' | 'BRONZE';
  isAdmin: boolean;
  formField: string;
  companyForm: UseFormReturn<CreateCompanyFormValues>;
  applicationName: string;
  onPlanChange: (plan: 'GOLD' | 'SILVER' | 'BRONZE' | undefined) => void;
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

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

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
              {/* {plan} */}
              {toTitleCase(plan)}
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
                    onPlanChange(newPlan);
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
