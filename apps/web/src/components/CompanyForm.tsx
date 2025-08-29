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
  // LucideTrash2,
} from 'lucide-react';
import { AppPlansContainer } from './AppPlansContainer';
import { graphql } from '@/gql';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
  createCompanySchema,
  updateCompanySchema,
} from './schemas/CompanyFormSchema';
import {
  Application,
  Company,
  CreateCompanyMutation,
  CreateCompanyMutationVariables,
  Plan,
  Role,
  UpdateCompanyMutation,
  UpdateCompanyMutationVariables,
} from '@/gql/graphql';
import { useMutation } from 'urql';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminForm } from './AdminForm';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors, isCompanyAdmin } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AssociateDetails } from './AssociateDetails';
import { CompanyDetails } from './CompanyDetails';

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
  // setIsDeleteModalOpen,
}: CompanyFormProps) => {
  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = company
    ? isCompanyAdmin(session?.user?.userPermissions, company?.id)
    : false;

  const router = useRouter();

  const [, createCompany] = useMutation<
    CreateCompanyMutation,
    CreateCompanyMutationVariables
  >(createCompanyMutation);

  const [, updateCompany] = useMutation<
    UpdateCompanyMutation,
    UpdateCompanyMutationVariables
  >(updateCompanyMutation);

  const companyForm = useForm<
    CreateCompanyFormValues | UpdateCompanyFormValues
  >({
    resolver: zodResolver(company ? updateCompanySchema : createCompanySchema),
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
          handleGraphQLErrors(result.error);

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
        createCompanyInput: data as CreateCompanyFormValues,
      })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);

          // Success
          if (result.data) {
            showAlertToast({
              title: responses.successfulCompanyCreation,
              variant: 'success',
            });
            router.push(`/company/${result.data?.createCompany.id}`);
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

  const sandvikAdminUserInfo = company?.users?.find(
    (user) => user.id === company.sandvikAdminUserId,
  );

  return (
    <>
      <Form {...companyForm}>
        <form onSubmit={companyForm.handleSubmit(onSubmit)}>
          <div className="w-full mt-4 flex flex-col gap-20">
            {/* Company details */}
            {(isUserSandvikAdmin || isUserCompanyAdmin) && (
              <CompanyDetailsForm companyForm={companyForm} />
            )}

            {company && !isUserSandvikAdmin && !isUserCompanyAdmin && (
              <CompanyDetails company={company} />
            )}

            {/* App plans */}
            <div>
              <div className="flex justify-between">
                <Headline
                  as="h2"
                  color="foreground"
                  variant="medium"
                  className="ml-8"
                >
                  {isUserSandvikAdmin ? 'Plans' : 'Your plans'}
                </Headline>

                {!isUserSandvikAdmin && (
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
                {Object.values(Application).map((appName) => {
                  const existingPlan = company?.plans?.find(
                    (plan) => plan.applicationName === appName,
                  );

                  const appPlan = existingPlan || {
                    applicationName: appName,
                    planLevel: '',
                    expiringDate: 0,
                  };

                  return (
                    <AppPlansContainer
                      appPlan={appPlan as Plan}
                      key={existingPlan?.id || appPlan.applicationName}
                      isUserSandvikAdmin={isUserSandvikAdmin}
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
                isUserSandvikAdmin
                  ? 'Sandvik admin'
                  : 'Sandvik associate contact details'
              }
            >
              {isUserSandvikAdmin && <AdminForm companyForm={companyForm} />}
              {!isUserSandvikAdmin && (
                <AssociateDetails sandvikAdminUserInfo={sandvikAdminUserInfo} />
              )}
            </ContentHolder>
          </div>

          {/* Submit & Inactivate buttons */}
          {(isUserSandvikAdmin || isUserCompanyAdmin) && (
            <div className="flex gap-6 justify-end self-end mt-[40px]">
              {/* {!isNewCompany && (
                <Button
                  variant="destructive"
                  size="large"
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <LucideTrash2 />
                  Inactivate company
                </Button>
              )} */}

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
          )}
        </form>
      </Form>
    </>
  );
};
