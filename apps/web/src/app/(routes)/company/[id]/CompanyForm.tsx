'use client';

import {
  CreateCompanyFormValues,
  createCompanyFormSchema,
} from '@/components/schemas/CompanyFormSchema';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { useForm } from 'react-hook-form';
// import { AdminForm } from '@/components/AdminForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAppPlansContainer } from '@/components/CreateAppPlansContainer';
import { LucideCircleCheckBig, LucideSparkles } from 'lucide-react';
import { Button, ContentHolder, Form, Headline, Text } from '@gsp/ui';
import { CompanyCreateDetailsForm } from '@/components/CompanyCreateDetailsForm';

// TODO - move to shared types?
type IPlan = {
  id: string;
  companyId: string;
  applicationName: string;
  planLevel?: 'GOLD' | 'SILVER' | 'BRONZE';
  expiringDate: Date;
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

const createCompanyMutation = graphql(`
  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {
    createCompany(createCompanyInput: $createCompanyInput) {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
      plans {
        id
        applicationName
        planLevel
        expiringDate
      }
    }
  }
`);

export function CompanyForm({ company, isAdmin, mode }: CompanyFormProps) {
  const [result, createCompany] = useMutation(createCompanyMutation);
  const companyForm = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanyFormSchema),
    defaultValues: {
      name: '',
      companyContactEmail: '',
      orgNumber: '',
      country: '',
      city: '',
      address: '',
      postalCode: '',
      userPermissions: [{ userId: '6411e9b8-7925-4c80-b76b-8f5d47d19aec' }],
      plans: [], // Initialize empty array for the plans
      // assignSandvikAdministrator: '',
    },
  });
  console.log('Result: ', result);
  const onSubmit = (data: CreateCompanyFormValues) => {
    createCompany({ createCompanyInput: data }).then((result) => {
      console.log('Submitting data:', JSON.stringify(data, null, 2));
      if (result.error) {
        console.error('Error: ', result.error);
      } else {
        if (result.data) {
          console.log('Company created: ', result.data.createCompany);
        }
      }
    });
  };

  return (
    <Form {...companyForm}>
      <form onSubmit={companyForm.handleSubmit(onSubmit)}>
        <div className="w-full mt-4 flex flex-col gap-20">
          <CompanyCreateDetailsForm companyForm={companyForm} />
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
                  <CreateAppPlansContainer
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
            {/* {isAdmin && <AdminForm companyForm={companyForm} />} */}
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
