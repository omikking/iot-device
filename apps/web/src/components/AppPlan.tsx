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
  onPlanChange: (plan: 'Gold' | 'Silver' | 'Bronze' | undefined) => void;
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

  return (
    <div
      className={`flex justify-between items-center h-14 border-b border-gray-200 py-3 px-6 ${
        isActive ? 'bg-neutral-1' : ''
      }`}
    >
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

            {user === 'Superadmin' && (
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
