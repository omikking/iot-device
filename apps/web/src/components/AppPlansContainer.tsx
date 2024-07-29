import { Badge, Dropdown, Headline } from '@gsp/ui';
import { LucideCircleCheckBig } from 'lucide-react';
import { AppPlan } from './AppPlan';

export const AppPlansContainer = ({ appData }) => {
  const { name, activePlan } = appData;

  return (
    <div
      key={appData.id}
      className="w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-5"
    >
      {/* Header */}
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-5 py-5 px-6">
        <Headline variant="smallBold" color="foreground" as="h3">
          {name}
        </Headline>

        {activePlan && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}
      </div>

      <AppPlan plan="Gold" activePlan={activePlan} />
      <AppPlan plan="Silver" activePlan={activePlan} />
      <AppPlan plan="Bronze" activePlan={activePlan} />

      {/* Calendar */}
      {/* Fix this later to use calendar etc */}
      {activePlan && (
        <div className="py-6 px-6 ui-border-b ui-border-neutral-5">
          <Dropdown id={''} options={[]} position="bottom" />
        </div>
      )}
    </div>
  );
};
