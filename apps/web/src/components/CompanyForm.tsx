'use client';
import { Button, ContentHolder, Form, Headline, Text } from '@gsp/ui';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import {
  LucideCircleCheckBig,
  LucideSparkles,
  LucideTrash2,
} from 'lucide-react';
import { AppPlansContainer } from './AppPlansContainer';
import { DevmodeToggle } from './DevmodeToggle';
import { graphql } from '@/gql';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
  createCompanyFormSchema,
  updateCompanyFormSchema,
} from './schemas/CompanyFormSchema';
import { Company, Plan } from '@/gql/graphql';
import { useMutation } from 'urql';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminForm } from './AdminForm';
import { AssociateDetailsForm } from './AssociateDetailsForm';

const allPlans = [
  { applicationName: 'PULL_TEST' },
  { applicationName: 'XCYCLOPS' },
  { applicationName: 'ULTRABOLTS' },
];

const createCompanyMutation = graphql(`
  mutation createCompany($createCompanyInput: CreateCompanyInput!) {
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
      users {
        id
        fullName
      }
    }
  }
`);

const updateCompanyMutation = graphql(`
  mutation updateCompany(
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
      users {
        id
        fullName
      }
    }
  }
`);

type CompanyFormProps = {
  company?: Company;
  isNewCompany: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
};

export const CompanyForm = ({
  company,
  isNewCompany,
  setIsDeleteModalOpen,
}: CompanyFormProps) => {
  // Temporary state for devmode
  const [isAdmin, setIsAdmin] = useState(true);
  const user = isAdmin ? 'Superadmin' : 'Client';

  const [, createCompany] = useMutation<CreateCompanyFormValues>(
    createCompanyMutation,
  );
  const [, updateCompany] = useMutation<UpdateCompanyFormValues>(
    updateCompanyMutation,
  );

  const companyForm = useForm<
    CreateCompanyFormValues | UpdateCompanyFormValues
  >({
    resolver: zodResolver(
      company ? updateCompanyFormSchema : createCompanyFormSchema,
    ),
    defaultValues: {
      name: company?.name || '',
      companyContactEmail: company?.companyContactEmail || '',
      orgNumber: company?.orgNumber || '',
      country: company?.country || '',
      city: company?.city || '',
      address: company?.address || '',
      postalCode: company?.postalCode || '',
      plans: company?.plans || [],
      sandvikAdminUserId: company?.sandvikAdminUserId || '',
    },
  });

  const onSubmit: SubmitHandler<
    CreateCompanyFormValues | UpdateCompanyFormValues
  > = (data) => {
    console.log('Submit');

    if (company) {
      updateCompany({
        id: company.id,
        updateCompanyInput: data,
      }).then((result) => {
        // @TODO Add component later for handling success & error
        console.log(result);
      });
    }

    if (!company && isNewCompany) {
      createCompany({
        createCompanyInput: data,
      }).then((result) => {
        // @TODO Add component later for handling success & error
        console.log(result);
      });
    }
  };

  useEffect(() => {
    // Update company data if company exists
    if (company) {
      companyForm.reset({
        ...company,
        sandvikAdminUserId: company.sandvikAdminUserId ?? '',
        plans: company.plans || [],
      });
    }
  }, [company]);

  return (
    <>
      <DevmodeToggle user={user} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <Form {...companyForm}>
        <form
          onSubmit={companyForm.handleSubmit(onSubmit, (errors) =>
            console.log(errors),
          )}
        >
          <div className="w-full mt-4 flex flex-col gap-20">
            {/* Company details */}
            <CompanyDetailsForm companyForm={companyForm} />

            {/* App plans */}
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

              <div className="w-full flex justify-between items-start bg-main-white mt-4 gap-6">
                {allPlans.map((planType) => {
                  const existingPlan = company?.plans?.find(
                    (plan) => plan.applicationName === planType.applicationName,
                  );

                  const appPlan = existingPlan || {
                    applicationName: planType.applicationName,
                    planLevel: '',
                    expiringDate: 0,
                  };

                  return (
                    <AppPlansContainer
                      appPlan={appPlan as Plan}
                      key={existingPlan?.id || appPlan.applicationName}
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

          {/* Submit & Inactivate buttons */}
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
    </>
  );
};
