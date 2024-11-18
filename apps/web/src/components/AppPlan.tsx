import { Badge, FormControl, FormField, FormItem, Switch, Text } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';

interface AppPlanProps {
  plan: 'Gold' | 'Silver' | 'Bronze';
  activePlan: 'Gold' | 'Silver' | 'Bronze' | undefined;
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
      <Text color="foreground" variant="medium">
        {plan}
      </Text>

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

      {user === 'Client' && isActive && (
        <Badge
          variant={'primary'}
          className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1"
        >
          <LucideCircleCheckBig className="h-4 w-4" />
          <span>Your selected plan</span>
        </Badge>
      )}
    </div>
  );
};
