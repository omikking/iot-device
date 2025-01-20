import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
import { AppPlan } from '@/components/AppPlan';

const getFormFieldName = (name: string) => {
  switch (name) {
    // case 'Pull-test':
    case 'PULL_TEST':
      return 'pullTestPlan';
    // case 'xCyclops':
    case 'XCYCLOPS':
      return 'xCyclopsPlan';
    // case 'Ultrabots':
    case 'ULTRABOLTS':
      return 'ultraboltsPlan';
  }
};

interface AppPlansContainerProps {
  appPlan: {
    id: string;
    applicationName: string;
    planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
  };
  isAdmin: boolean;
}

// @TODO: Remove temporary isAdmin prop
export const AppPlansContainer = ({
  appPlan,
  isAdmin,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());
  const { applicationName, planLevel } = appPlan;
  const user = isAdmin ? 'Superadmin' : 'Client';
  const formField = getFormFieldName(applicationName) || '';

  // console.log('APPPLAN: ', appPlan);
  // console.log('planLevel', planLevel);
  // console.log('applicationName', applicationName);

  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="small" color="foreground" as="h3" isBold>
          {applicationName}
        </Headline>

        {user === 'Superadmin' && planLevel && (
          <Badge variant="attention">
            <LucideCircleCheckBig size="14" />
            Active
          </Badge>
        )}

        {user === 'Client' && !planLevel && (
          <Badge variant="primary">
            <LucideSparkles size="14" />
            Available plans
          </Badge>
        )}
      </div>

      {/* Plans */}
      <AppPlan
        plan="GOLD"
        activePlan={planLevel}
        isAdmin={isAdmin}
        formField={formField}
      />
      <AppPlan
        plan="SILVER"
        activePlan={planLevel}
        isAdmin={isAdmin}
        formField={formField}
      />
      <AppPlan
        plan="BRONZE"
        activePlan={planLevel}
        isAdmin={isAdmin}
        formField={formField}
      />

      {/* Calendar */}
      {planLevel && (
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
