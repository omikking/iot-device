import { Switch, Text } from '@gsp/ui';
import { cn } from 'node_modules/@gsp/ui/src/lib/utils';

interface AppPlanProps {
  plan: 'Gold' | 'Silver' | 'Bronze';
  activePlan: 'Gold' | 'Silver' | 'Bronze';
}

// @TODO fix toggle state and bg color on plan when selected
export const AppPlan = ({ plan, activePlan }: AppPlanProps) => {
  return (
    <div
      className={cn(
        'flex justify-between items-center ui-border-b ui-border-neutral-5 py-3 px-6',
        plan === activePlan && 'ui-bg-neutral-1',
      )}
    >
      <Text color="foreground" variant="medium">
        {plan}
      </Text>

      <Switch checked={plan === activePlan} />
    </div>
  );
};
