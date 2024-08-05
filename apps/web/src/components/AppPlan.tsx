import { Badge, Switch, Text } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';
import { cn } from 'node_modules/@gsp/ui/src/lib/utils';

interface AppPlanProps {
  plan: 'Gold' | 'Silver' | 'Bronze';
  activePlan: 'Gold' | 'Silver' | 'Bronze';
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({ plan, activePlan }: AppPlanProps) => {
  const user = 'Superadmin';
  // const user = 'Client';

  return (
    <div
      className={cn(
        'flex justify-between items-center ui-border-b ui-border-neutral-3 py-3 px-6',
        plan === activePlan && 'ui-bg-neutral-1',
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
