import { Badge, Switch, Text } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';
import { cn } from 'node_modules/@gsp/ui/src/lib/utils';

interface AppPlanProps {
  plan: 'Gold' | 'Silver' | 'Bronze';
  activePlan: 'Gold' | 'Silver' | 'Bronze';
  // @TODO: Remove temporary isAdmin prop
  isAdmin: boolean;
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({ plan, activePlan, isAdmin }: AppPlanProps) => {
  const user = isAdmin ? 'Superadmin' : 'Client';

  return (
    <div
      className={cn(
        'flex justify-between items-center border-b border-neutral-3 py-3 px-6',
        plan === activePlan && 'bg-neutral-1',
      )}
    >
      <Text color="foreground" variant="medium">
        {plan}
      </Text>

      {user === 'Superadmin' && <Switch checked={plan === activePlan} />}

      {user === 'Client' && plan === activePlan && (
        <Badge variant="attention">
          <LucideCircleCheckBig size="14" />
          Your selected plan
        </Badge>
      )}
    </div>
  );
};
