import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { AppPlan } from '@/components/AppPlan';

// @TODO: Remove temporary isAdmin prop
export const AppPlansContainer = ({ appPlan, isAdmin }) => {
  const { name, activePlan } = appPlan;

  // const [date, setDate] = useState<Date | undefined>(new Date());

  const user = isAdmin ? 'Superadmin' : 'Client';

  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="smallBold" color="foreground" as="h3">
          {name}
        </Headline>

        {user === 'Superadmin' && activePlan && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}

        {user === 'Client' && !activePlan && (
          <Badge variant="primary">
            <LucideSparkles size="14" />
            Available plans
          </Badge>
        )}
      </div>

      {/* Plans */}
      <AppPlan plan="Gold" activePlan={activePlan} isAdmin={isAdmin} />
      <AppPlan plan="Silver" activePlan={activePlan} isAdmin={isAdmin} />
      <AppPlan plan="Bronze" activePlan={activePlan} isAdmin={isAdmin} />

      {/* Calendar */}
      {activePlan && (
        <div className="py-5 px-6 ui-border-b ui-border-neutral-2">
          {user === 'Client' && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires 2025-08-10
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              {/* Do we want to have it as disabled or invisible when plan is not selected? */}
              {/* <SingleDateCalendar disabled={activePlan} className="mt-2" /> */}
              <SingleDateCalendar className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
