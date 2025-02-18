'use client';
import {
  LucideUsers,
  LucideTrash2,
  LucidePyramid,
  LucideMountain,
  LucideSparkles,
  LucideMoveRight,
  LucideCircleCheckBig,
} from 'lucide-react';
import {
  Form,
  Text,
  Button,
  Headline,
  NavigationCard,
  ContentHolder,
} from '@gsp/ui';
import {
  updateCompanyFormSchema,
  UpdateCompanyFormValues,
} from '@/components/schemas/CompanyFormSchema';
import Link from 'next/link';
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

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const { company, error, isLoading, isNew } = useCompany(params.id);
  const [result, updateCompany] = useMutation(updateCompanyMutation);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const companyToEditName = 'E-Corp';
  const user = isAdmin ? 'Superadmin' : 'Client';

  const allPlansTypes = [
    { id: 'pull-test', applicationName: 'PULL_TEST' },
    { id: 'xcyclops', applicationName: 'XCYCLOPS' },
    { id: 'ultrabolts', applicationName: 'ULTRABOLTS' },
  ] as const;

  // @TODO: validate the form
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

  useEffect(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        companyContactEmail: company.companyContactEmail,
        orgNumber: company.orgNumber,
        country: company.country,
        city: company.city,
        address: company.address,
        postalCode: company.postalCode,
        plans: company.plans.map((plan) => ({
          id: plan.id,
          applicationName: plan.applicationName,
          planLevel: plan.planLevel,
          expiringDate: plan.expiringDate || new Date().toISOString(),
        })),
      });
    }
  }, [company]);

  const onSubmit = (data: UpdateCompanyFormValues) => {
    console.log('Result: ', result);
    updateCompany({ id: params.id, updateCompanyInput: data }).then(
      (result) => {
        console.log('Submitted data:', JSON.stringify(data, null, 2));
        if (result.error) {
          console.error('Error:', result.error);
        } else {
          if (result.data) {
            console.log('Company updated:', result.data.updateCompany);
          }
        }
      },
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!company && !isNew) return <div>Company not found</div>;

  // if (isNew) {
  //   return <CompanyCreate isAdmin={isAdmin} mode="new" />;
  // }
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />
      {/* TODO break down into a component DevModeToggle, something like that */}
      <div className="fixed opacity-10 hover:opacity-80 duration-100 ease-linear right-24 top-24 bg-slate-200 p-4 w-56">
        <Headline as="h2" variant="medium" color="foreground">
          Dev mode
        </Headline>
        <Text variant="medium" color="foreground">
          Toggle user type
        </Text>
        <Text variant="medium" color="foreground">
          Current user: {user}
        </Text>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setIsAdmin(!isAdmin)}
          isWide
        >
          Set to {isAdmin ? 'Client' : 'Superadmin'}
        </Button>
      </div>

      <Headline as="h1" variant="xl" color="foreground">
        {isNew ? 'Add Company' : company?.name}
      </Headline>

      <div className="flex gap-8">
        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Users
          </Headline>
          <LucideUsers />
          <Button variant="secondary" size="small" asChild>
            <Link href="/users">
              <LucideMoveRight />
              View users
            </Link>
          </Button>
        </NavigationCard>

        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Sites
          </Headline>
          <LucideMountain />
          <Button variant="secondary" size="small" asChild>
            <Link href="/sites">
              <LucideMoveRight />
              View sites
            </Link>
          </Button>
        </NavigationCard>

        <NavigationCard>
          <Headline as="h3" variant="medium" color="foreground">
            Site locations
          </Headline>
          <LucidePyramid />
          <Button variant="secondary" size="small" asChild>
            <Link href="/sitelocations">
              <LucideMoveRight />
              View site locations
            </Link>
          </Button>
        </NavigationCard>
      </div>

      <hr className="w-full border-neutral-2" />

      <Form {...companyForm}>
        <form
          onSubmit={companyForm.handleSubmit(onSubmit)}
          // className="w-full flex flex-row flex-wrap gap-6" do we need this?
        >
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
              {isNew ? 'Send invitation' : 'Update company details'}
            </Button>

            {!isNew && (
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
              {` ${companyToEditName}. `}
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
    </main>
  );
}
