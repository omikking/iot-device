import { Badge, Dropdown, Headline, Switch, Text } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';

// @TODO fix toggle state and bg color on plan when selected
const PlanContainer = ({ plan }) => {
  return (
    <div className="flex justify-between items-center ui-border-b ui-border-neutral-5 py-3 px-6">
      <Text color="foreground" variant="medium">
        {plan}
      </Text>

      <Switch />
    </div>
  );
};

export const CompanyPlanSelection = ({ appPlan }) => {
  return (
    <div
      key={appPlan.id}
      className="w-[400px] bg-main-white ui-border-2 ui-border-neutral-5"
    >
      {/* Header */}
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-5 py-5 px-6">
        <Headline variant="smallBold" color="foreground" as="h3">
          {appPlan.name}
        </Headline>

        <Badge variant="attention">
          <LucideCircleCheckBig size="14" />
          Active
        </Badge>
      </div>

      <PlanContainer plan="Gold" />
      <PlanContainer plan="Silver" />
      <PlanContainer plan="Bronze" />

      {/* Calendar */}
      {/* Fix this later to use calendar etc */}
      <div className="py-6 px-6">
        <Dropdown id={''} options={[]} position="bottom" />
      </div>
    </div>
  );
};
