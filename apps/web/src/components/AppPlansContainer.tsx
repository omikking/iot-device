import {
  LucideCalendar,
  LucideCircleCheckBig,
  LucideSparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { AppPlan } from '@/components/AppPlan';
import { UseFormReturn } from 'react-hook-form';
import { UpdateCompanyFormValues } from './schemas/CompanyFormSchema';
import { Badge, FormLabel, Headline, SingleDateCalendar } from '@gsp/ui';
//import { DateTime } from 'next-auth/providers/kakao';

const getFormFieldName = (name: string) => {
  switch (name) {
    case 'PULL_TEST':
      return 'pullTestPlan';
    case 'XCYCLOPS':
      return 'xCyclopsPlan';
    case 'ULTRABOLTS':
      return 'ultraboltsPlan';
    default:
      return undefined;
  }
};

type PlanLevel = 'GOLD' | 'SILVER' | 'BRONZE';

interface AppPlansContainerProps {
  appPlan: {
    id: string;
    applicationName: string;
    planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
    expiringDate: Date;
  };
  isAdmin: boolean;
  companyForm: UseFormReturn<UpdateCompanyFormValues>;
}

const isValidPlanLevel = (plan: string | undefined): plan is PlanLevel => {
  return plan === 'GOLD' || plan === 'SILVER' || plan === 'BRONZE';
};

export const AppPlansContainer = ({
  appPlan,
  isAdmin,
  companyForm,
}: AppPlansContainerProps) => {
  // @TODO const [date, setDate] = useState<Date | undefined>(new Date());
  const { applicationName } = appPlan;
  // const [activePlan, setActivePlan] = useState<
  //   'GOLD' | 'SILVER' | 'BRONZE' | undefined
  // >(initialActivePlan);

  const user = isAdmin ? 'Superadmin' : 'Client';
  const formField = getFormFieldName(applicationName) || '';
  //const [result, updateExpiryDate] = useMutation(UpdateExpiryDate);
  //console.log('result', updateExpiryDate);

  // used memo to avoid re-rendering, and update the plan level based on the form values
  const activePlan = useMemo(() => {
    const currentPlans = companyForm.getValues('plans') || [];
    const currentPlan = currentPlans.find(
      (p) => p.applicationName === applicationName,
    );
    return isValidPlanLevel(currentPlan?.planLevel)
      ? currentPlan.planLevel
      : undefined;
  }, [companyForm.getValues('plans'), applicationName]);

  const expiringDate = useMemo(() => {
    const currentPlans = companyForm.getValues('plans') || [];
    const currentPlan = currentPlans.find(
      (p) => p.applicationName === applicationName,
    );

    return currentPlan?.expiringDate ?? undefined;
  }, [companyForm.getValues('plans'), applicationName]);

  // export to a utility file?
  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const handlePlanChange = (plan: 'GOLD' | 'SILVER' | 'BRONZE' | undefined) => {
    const currentPlans = companyForm.getValues('plans') || [];
    // Update plans array based on the change
    let updatedPlans;
    if (plan === undefined) {
      // Remove this application's plan
      updatedPlans = currentPlans.filter(
        (p) => p.applicationName !== applicationName,
      );
    } else {
      const existingPlanIndex = currentPlans.findIndex(
        (p) => p.applicationName === applicationName,
      );

      if (existingPlanIndex >= 0) {
        // Update existing plan
        updatedPlans = currentPlans.map((p, index) =>
          index === existingPlanIndex ? { ...p, planLevel: plan } : p,
        );
      } else {
        // Add new plan
        updatedPlans = [
          ...currentPlans,
          {
            id: '',
            applicationName,
            planLevel: plan,
            expiringDate,
          },
        ];
      }
    }

    // Update form with new plans array
    console.log('Updated Plans:', updatedPlans);
    companyForm.setValue('plans', updatedPlans, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleExpiryDateChange = (expiringDate: Date | undefined) => {
    const currentPlans = companyForm.getValues('plans') || [];
    // Update plans array based on the change
    let updatedPlans;
    const utcDate = new Date(
      Date.UTC(
        expiringDate.getFullYear(),
        expiringDate.getMonth(),
        expiringDate.getDate(),
      ),
    );

    if (expiringDate === undefined) {
      console.log('inside if');
      // Remove this application's plan
      updatedPlans = currentPlans.filter(
        (p) => p.applicationName !== applicationName,
      );
    } else {
      console.log('inside else');
      const existingPlanIndex = currentPlans.findIndex(
        (p) => p.applicationName === applicationName,
      );
      // const formattedDate = expiringDate.to;
      if (existingPlanIndex >= 0) {
        // Update existing plan
        updatedPlans = currentPlans.map((p, index) =>
          index === existingPlanIndex ? { ...p, expiringDate: utcDate } : p,
        );
      } else {
        // Add new plan
        updatedPlans = [
          ...currentPlans,
          {
            id: '',
            applicationName,
            planLevel: '',
            expiringDate: utcDate,
          },
        ];
      }
    }
    console.log('Updated Plans:', updatedPlans);
    // Update form with new plans array
    companyForm.setValue('plans', updatedPlans, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  return (
    <div
      key={appPlan.id}
      className="w-1/3 max-w-[400px] bg-main-white ui-border-2 ui-border-b ui-border-neutral-2"
    >
      <div className="flex justify-between items-center ui-border-b ui-border-neutral-2 py-5 px-6">
        <Headline variant="small" color="foreground" as="h3" isBold>
          {toTitleCase(applicationName.replace('_', ' '))}
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
        plan="GOLD"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="SILVER"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />
      <AppPlan
        plan="BRONZE"
        activePlan={activePlan}
        isAdmin={isAdmin}
        formField={formField}
        companyForm={companyForm}
        applicationName={applicationName}
        onPlanChange={handlePlanChange}
      />

      {/* Calendar */}
      {/* {activePlan && (
        <div className="py-5 px-6 border-b border-neutral-2">
          {user === 'Client' && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires{' '}
              {expiringDate
                ? new Date(expiringDate).toLocaleDateString()
                : 'Select date'}
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              <SingleDateCalendar
                className="mt-2"
                expiryDate={expiringDate} // Ensure it gets the current expiry date
                onDateChange={handleExpiryDateChange} // Update expiry date when selected
              />
            </>
          )}
        </div>
      )} */}
      {/* Calendar */}
      {activePlan && (
        <div className="py-5 px-6 border-b border-neutral-2">
          {user === 'Client' && (
            <Badge variant="primary">
              <LucideCalendar size="14" />
              Your plan expires{' '}
              {expiringDate
                ? new Date(expiringDate).toISOString()
                : 'Select date'}
            </Badge>
          )}

          {user === 'Superadmin' && (
            <>
              <FormLabel>Expiring date</FormLabel>
              <SingleDateCalendar
                className="mt-2"
                expiryDate={expiringDate} // Ensure it gets the current expiry date
                onDateChange={(newExpiryDate) =>
                  handleExpiryDateChange(newExpiryDate)
                } // Update expiry date when selected
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
