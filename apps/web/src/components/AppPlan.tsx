import {
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Switch,
} from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';

interface AppPlanProps {
  plan: 'GOLD' | 'SILVER' | 'BRONZE';
  activePlan?: 'GOLD' | 'SILVER' | 'BRONZE';
  isAdmin: boolean;
  formField: string;
  onPlanChange: (plan: 'GOLD' | 'SILVER' | 'BRONZE' | undefined) => void;
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({
  plan,
  activePlan,
  isAdmin,
  formField,
  onPlanChange,
}: AppPlanProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';
  const isActive = plan === activePlan;

  const toTitleCase = (str: string) => {
    // First convert to lowercase, then capitalize first letter
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
          name={formField}
          render={({ field }) => (
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
                    const newPlan = checked ? plan : undefined;
                    field.onChange(checked ? plan : undefined);
                    onPlanChange(newPlan);
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
            {/* {plan} */}
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

      {/* {user === 'Client' && (
        <div className="flex w-full justify-between items-center">
          <FormLabel
            className={`text-lg font-semibold ${isActive ? 'text-orange-600' : 'text-gray-800'}`}
          >
            {plan}
          </FormLabel>

          {isActive && (
            <Badge variant="attention" className="flex items-center">
              <LucideCircleCheckBig size="16" className="mr-1" />
              Your selected plan
            </Badge>
          )}
        </div>
      )} */}
    </div>
  );
};
