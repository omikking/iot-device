import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { AppPlan } from '@/components/AppPlan';

const getFormFieldName = (name: string) => {
  switch (name) {
    case 'Pull-test':
      return 'pullTestPlan';
    case 'xCyclops':
      return 'xCyclopsPlan';
    case 'Ultrabots':
      return 'ultrabotsPlan';
  }
};

interface AppPlansContainerProps {
  appPlan: {
    id: string;
    name: string;
    activePlan?: 'Gold' | 'Silver' | 'Bronze';
  };
  isAdmin: boolean;
}

// @TODO: Remove temporary isAdmin prop
export const AppPlansContainer = ({
  appPlan,
  isAdmin,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());
  const { name, activePlan } = appPlan;
  const user = isAdmin ? 'Superadmin' : 'Client';
  const formField = getFormFieldName(name) || '';

  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="small" color="foreground" as="h3" isBold>
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
      <AppPlan
        plan="Gold"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
      />
      <AppPlan
        plan="Silver"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
      />
      <AppPlan
        plan="Bronze"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
      />

      {/* Calendar */}
      {activePlan && (
        <div className="py-5 px-6 border-b border-neutral-2">
          {user === 'Client' && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires 2025-08-10
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              {/* @TODO Do we want to have it as disabled or invisible when plan is not selected? */}
              {/* <SingleDateCalendar disabled={activePlan} className="mt-2" /> */}
              <SingleDateCalendar className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
