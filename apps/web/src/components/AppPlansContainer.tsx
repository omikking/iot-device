import { Badge, Calendar, FormLabel, Headline } from '@gsp/ui';
import { LucideCalendar, LucideCircleCheckBig } from 'lucide-react';
import { AppPlan } from './AppPlan';
import { useState } from 'react';

export const AppPlansContainer = ({ appData }) => {
  const { name, activePlan } = appData;

  const [date, setDate] = useState<Date | undefined>(new Date());

  const user = 'Superadmin';
  // const user = 'Client';

  return (
    <div
      key={appData.id}
      className="w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
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
      </div>

      {/* Plans */}
      <AppPlan plan="Gold" activePlan={activePlan} />
      <AppPlan plan="Silver" activePlan={activePlan} />
      <AppPlan plan="Bronze" activePlan={activePlan} />

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
              <Calendar
                // Do we want to have it as disabled or invisible when plan is not selected?
                // disabled={activePlan}
                selectedDate={date}
                onSelect={setDate}
                className="mt-2"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
