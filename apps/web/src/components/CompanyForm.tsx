'use client';
import {
  Button,
  ContentHolder,
  Form,
  Headline,
  Text,
  showAlertToast,
} from '@gsp/ui';
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
import { responses } from '@/app/uitexts/responses';
import { GraphQLErrorExtensions } from '@/libs/utils';

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
    if (company) {
      updateCompany({
        id: company.id,
        updateCompanyInput: data,
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            showAlertToast({
              title: responses.successfulCompanyUpdate,
              variant: 'success',
            });
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.companyUpdateFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
        });
    }

    if (!company && isNewCompany) {
      createCompany({
        createCompanyInput: data,
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }

          // Success
          if (result.data) {
            showAlertToast({
              title: responses.successfulCompanyCreation,
              variant: 'success',
            });
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.companyInvitationFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
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

  const formValues = companyForm.watch();
  const isDirty = companyForm.formState.isDirty;

  const isAnyFieldEmpty =
    !formValues.name ||
    !formValues.companyContactEmail ||
    !formValues.orgNumber ||
    !formValues.country ||
    !formValues.city ||
    !formValues.address ||
    !formValues.sandvikAdminUserId ||
    !formValues.postalCode;

  const isSubmitDisabled = isNewCompany
    ? isAnyFieldEmpty
    : !isDirty || isAnyFieldEmpty;
  return (
    <>
      <DevmodeToggle user={user} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <Form {...companyForm}>
        <form onSubmit={companyForm.handleSubmit(onSubmit)}>
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

          <div className="flex gap-6 justify-end self-end mt-[40px]">
            {!isNewCompany && (
              <Button
                variant="destructive"
                size="large"
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <LucideTrash2 />
                Inactivate company
              </Button>
            )}

            <Button
              variant="primary"
              size="large"
              type="submit"
              disabled={isSubmitDisabled}
            >
              <LucideCircleCheckBig />
              {isNewCompany ? 'Send invitation' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
