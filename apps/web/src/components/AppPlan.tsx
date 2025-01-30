import {
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from '@gsp/ui';
import { UseFormReturn } from 'react-hook-form';
import { LucideCircleCheckBig } from 'lucide-react';
import { UpdateCompanyFormValues } from './schemas/CompanyFormSchema';

interface AppPlanProps {
  plan: 'GOLD' | 'SILVER' | 'BRONZE';
  activePlan?: 'GOLD' | 'SILVER' | 'BRONZE';
  isAdmin: boolean;
  formField: string;
  companyForm: UseFormReturn<UpdateCompanyFormValues>;
  applicationName: string;
  onPlanChange: (plan: 'GOLD' | 'SILVER' | 'BRONZE' | undefined) => void;
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({
  plan,
  activePlan,
  isAdmin,
  companyForm,
  onPlanChange,
}: AppPlanProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';
  const isActive = plan === activePlan;

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div
      // @TODO Border is a bit off in the y-axis
      className={`flex justify-between items-center border-y border-gray-200 py-3 px-6 ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      {user === 'Superadmin' ? (
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
                {toTitleCase(plan)}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={activePlan === plan}
                  onCheckedChange={(checked) => {
                    onPlanChange(checked ? plan : undefined);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ) : (
        <div className="flex w-full justify-between items-center">
          <FormLabel
            className="flex items-center"
            variant="medium"
            color="foreground"
          >
            {toTitleCase(plan)}
          </FormLabel>
          {isActive && (
            <Badge variant="attention">
              <LucideCircleCheckBig />
              Your selected plan
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
