'use client';

import {
  CompanyFormValues,
  companyFormSchema,
} from '@/components/schemas/CompanyFormSchema';
import { useForm } from 'react-hook-form';
import { AdminForm } from '@/components/AdminForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { LucideCircleCheckBig, LucideSparkles } from 'lucide-react';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { Button, ContentHolder, Form, Headline, Text } from '@gsp/ui';

type IPlan = {
  id: string;
  companyId: string;
  applicationName: string;
  planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
  expiringDate: string;
};

type ICompany = {
  id: string;
  name: string;
  orgNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  companyContactEmail: string;
  plans: IPlan[];
  // users: IUser[];
  // sites: ISite[];
};

type CompanyFormProps = {
  company?: ICompany;
  isAdmin: boolean;
  mode: 'new' | 'edit';
};

const allPlansTypes = [
  { id: 'pull-test', applicationName: 'PULL_TEST' },
  { id: 'xcyclops', applicationName: 'XCYCLOPS' },
  { id: 'ultrabolts', applicationName: 'ULTRABOLTS' },
] as const;

export function CompanyForm({ company, isAdmin, mode }: CompanyFormProps) {
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      companyContactEmail: '',
      orgNumber: '',
      country: '',
      city: '',
      address: '',
      userPermissions: [{ userId: '6411e9b8-7925-4c80-b76b-8f5d47d19aec' }],
      plans: [], // Initialize empty array for the plans
      // assignSandvikAdministrator: '',
    },
  });

  return (
    <Form {...companyForm}>
      <form onSubmit={companyForm.handleSubmit((data) => console.log(data))}>
        <div className="w-full mt-4 flex flex-col gap-20">
          <CompanyDetailsForm companyForm={companyForm} />
          <div className="flex-col justify-between">
            <Headline
              as="h2"
              color="foreground"
              variant="medium"
              className="ml-8"
            >
              {isAdmin ? 'Plans' : 'Your plans'}
            </Headline>
            {!isAdmin && (
              <div className="flex items-center">
                <LucideSparkles size="20" />
                <Headline
                  as="h2"
                  color="foreground"
                  variant="medium"
                  className="ml-3"
                >
                  Want to update your plan?
                </Headline>
                <Text
                  color="foreground"
                  variant="medium"
                  className="mt-1 ml-4 underline underline-offset-2"
                >
                  Call +46 70 174 06 21
                </Text>
              </div>
            )}

            <div className="w-full flex justify-between items-start bg-main-white mt-4 gap-6">
              {allPlansTypes.map((planType) => {
                const existingPlan = company?.plans.find(
                  (plan) => plan.applicationName === planType.applicationName,
                );

                const appPlan = existingPlan || {
                  id: planType.id,
                  applicationName: planType.applicationName,
                  planLevel: undefined,
                  companyId: company?.id || '',
                  expiringDate: '',
                };

                return (
                  <AppPlansContainer
                    appPlan={appPlan}
                    key={appPlan.id}
                    isAdmin={isAdmin}
                    companyForm={companyForm}
                  />
                );
              })}
            </div>
          </div>

          <ContentHolder
            variant="general"
            headlineText={
              isAdmin ? 'Admin' : 'Sandvik associate contact details'
            }
          >
            {isAdmin && <AdminForm companyForm={companyForm} />}
          </ContentHolder>
        </div>
        <div className="flex justify-end mt-8">
          <Button variant="primary" size="large" type="submit">
            <LucideCircleCheckBig />
            {mode === 'new' ? 'Send invitation' : 'Update company details'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
