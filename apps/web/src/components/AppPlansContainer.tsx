import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { AppPlan } from '@/components/AppPlan';
import { useState } from 'react';

const getFormFieldName = (name: string) => {
  switch (name) {
    case 'Pull-test':
      return 'pullTestPlan';
    case 'xCyclops':
      return 'xCyclopsPlan';
    case 'Ultrabots':
      return 'ultrabotsPlan';
    default:
      return '';
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

export const AppPlansContainer = ({
  appPlan,
  isAdmin,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());

  const { name, activePlan: initialActivePlan } = appPlan;

  const [activePlan, setActivePlan] = useState<
    'Gold' | 'Silver' | 'Bronze' | undefined
  >(initialActivePlan);

  // @TODO: Remove temporary isAdmin prop when we have hook
  const user = isAdmin ? 'Superadmin' : 'Client';
  const formField = getFormFieldName(name) || '';

  const handlePlanChange = (plan: 'Gold' | 'Silver' | 'Bronze' | undefined) => {
    setActivePlan(plan);
  };

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

      {/* Selected Plan Label for Client */}
      {user === 'Client' && (
        <div className="px-6 py-3">
          <Badge variant={activePlan ? 'success' : 'neutral'}>
            {activePlan
              ? `Your selected plan: ${activePlan}`
              : 'No plan selected'}
          </Badge>
        </div>
      )}

      {/* Plans */}
      <AppPlan
        plan="Gold"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        onPlanChange={setActivePlan}
      />
      <AppPlan
        plan="Silver"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        onPlanChange={setActivePlan}
      />
      <AppPlan
        plan="Bronze"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        onPlanChange={setActivePlan}
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
              <SingleDateCalendar className="mt-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
