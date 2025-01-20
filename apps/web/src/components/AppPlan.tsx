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
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({
  plan,
  activePlan,
  isAdmin,
  formField,
}: AppPlanProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';
  const isActive = plan === activePlan;

  const toTitleCase = (str: string) => {
    // First convert to lowercase, then capitalize first letter
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div
      className={`flex justify-between items-center border-b border-gray-200 py-3 px-6 ${
        isActive ? 'bg-gray-50' : ''
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
                {plan}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === plan}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? plan : undefined);
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

      {/* {user === 'Client' && isActive && (
        <Badge variant={'attention'}>
          <LucideCircleCheckBig />
          Your selected plan
        </Badge>
      )} */}
    </div>
  );
};
