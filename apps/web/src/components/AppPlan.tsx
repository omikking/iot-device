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
  plan: 'Gold' | 'Silver' | 'Bronze';
  activePlan?: 'Gold' | 'Silver' | 'Bronze';
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

  return (
    <div
      className={`flex justify-between items-center border-b border-gray-200 py-3 px-6 ${
        isActive ? 'bg-gray-50' : ''
      }`}
    >
      <FormLabel
        className="flex items-center h-6"
        variant="medium"
        color="foreground"
      >
        {plan}
      </FormLabel>

      {user === 'Superadmin' && (
        <FormField
          name={formField}
          render={({ field }) => (
            <FormItem>
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
      )}

      {user === 'Client' && isActive && (
        <Badge variant={'attention'}>
          <LucideCircleCheckBig />
          Your selected plan
        </Badge>
      )}
    </div>
  );
};
