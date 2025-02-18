'use client';
import {
  LucideTrash2,
  LucideSparkles,
  LucideCircleCheckBig,
} from 'lucide-react';
import { Form, Text, Button, Headline, ContentHolder } from '@gsp/ui';
import {
  updateCompanyFormSchema,
  UpdateCompanyFormValues,
} from '@/components/schemas/CompanyFormSchema';
import { useEffect, useState } from 'react';
import { GoBack } from '@/components/GoBack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { useCompany } from '@/components/urql-companies/CompanyClientUrql';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { AssociateDetailsForm } from '@/components/AssociateDetailsForm';
import { AdminForm } from '@/components/AdminForm';
import { DevmodeToggle } from '@/components/DevmodeToggle';
import { CompanyNavigationCards } from '@/components/CompanyNavigationCards';

const updateCompanyMutation = graphql(`
  mutation UpdateCompany(
    $id: String!
    $updateCompanyInput: UpdateCompanyInput!
  ) {
    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {
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

const allPlansTypes = [
  { id: 'pull-test', applicationName: 'PULL_TEST' },
  { id: 'xcyclops', applicationName: 'XCYCLOPS' },
  { id: 'ultrabolts', applicationName: 'ULTRABOLTS' },
] as const;

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const isNewCompany = params.id === 'new';
  // Does not call if it's new company.
  const { company } = isNewCompany ? { company: null } : useCompany(params.id);

  const [result, updateCompany] = useMutation(updateCompanyMutation);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Temporary state for devmode
  const [isAdmin, setIsAdmin] = useState(true);
  const user = isAdmin ? 'Superadmin' : 'Client';

  const companyForm = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanyFormSchema),
    defaultValues: {
      name: '',
      companyContactEmail: '',
      orgNumber: '',
      country: '',
      city: '',
      address: '',
      postalCode: '',
      plans: [],
    },
  });

  const onSubmit = (data: UpdateCompanyFormValues) => {
    updateCompany({ id: params.id, updateCompanyInput: data });
  };

  useEffect(() => {}, [company]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      <DevmodeToggle user={user} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <Headline as="h1" variant="xl" color="foreground">
        {isNewCompany ? 'Add Company' : company?.name}
      </Headline>

      {!isNewCompany && <CompanyNavigationCards />}

      <Form {...companyForm}>
        <form onSubmit={companyForm.handleSubmit(onSubmit)}>
          <div className="w-full mt-4 flex flex-col gap-20">
            <CompanyDetailsForm companyForm={companyForm} />

            <div>
              <div className="flex justify-between">
                <Headline
                  as="h2"
                  color="foreground"
                  variant="medium"
                  className="ml-8"
                >
                  {user === 'Superadmin' ? 'Plans' : 'Your plans'}
                </Headline>

                {user === 'Client' && (
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
                      color="accent"
                      variant="medium"
                      className="mt-1 ml-4 underline underline-offset-2"
                    >
                      Call +46 70 174 06 21
                    </Text>
                  </div>
                )}
              </div>

              {/* App plans */}
              <div className="w-full flex justify-between items-start bg-main-white mt-4 gap-6">
                {allPlansTypes.map((planType) => {
                  const existingPlan = company?.plans.find(
                    (plan) => plan.applicationName === planType.applicationName,
                  );

                  const appPlan = existingPlan || {
                    id: planType.id,
                    applicationName: planType.applicationName,
                    planLevel: undefined,
                    companyId: company?.id,
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

            {/* Admin assignment */}
            <ContentHolder
              variant="general"
              headlineText={
                user === 'Superadmin'
                  ? 'Admin'
                  : 'Sandvik associate contact details'
              }
            >
              {user === 'Superadmin' && <AdminForm companyForm={companyForm} />}

              {user === 'Client' && (
                <AssociateDetailsForm companyForm={companyForm} />
              )}
            </ContentHolder>
          </div>

          <div className="flex flex-col gap-6 items-end self-end mt-[40px]">
            <Button variant="primary" size="large" type="submit">
              <LucideCircleCheckBig />
              {isNewCompany ? 'Send invitation' : 'Update company details'}
            </Button>

            {!isNewCompany && (
              <Button
                variant="destructive"
                size="large"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <LucideTrash2 />
                Inactivate company
              </Button>
            )}
          </div>
        </form>
      </Form>

      {isNewCompany && (
        <DeleteModalConfirmation
          deleteIcon="Company"
          deleteButtonText="Delete company"
          modalTitle="Delete company"
          modalText="Confirm inactivation"
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onDelete={() => {
            console.log('Deleting item...');
          }}
        >
          <div className="flex flex-col gap-4">
            <Text variant="medium" color={'foreground'} as="span">
              You are about to inactivate
              <Text variant="medium" color={'foreground'} as="span" isBold>
                {` ${company?.name}. `}
              </Text>
              <Text variant="medium" color={'foreground'} as="span">
                Are you sure you want to inactivate?
              </Text>
            </Text>
            <Text color={'foreground'} variant={'medium'}>
              The company data will not be deleted but the company will become
              inactive but able to recover data.
            </Text>
          </div>
        </DeleteModalConfirmation>
      )}
    </main>
  );
}
