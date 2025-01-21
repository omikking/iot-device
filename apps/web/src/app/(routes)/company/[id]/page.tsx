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
  ContentHolder,
  NavigationCard,
} from '@gsp/ui';
import {
  companyFormSchema,
  CompanyFormValues,
} from '@/components/schemas/CompanyFormSchema';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GoBack } from '@/components/GoBack';
import { useSearchParams } from 'next/navigation';
import { AdminForm } from '@/components/AdminForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { AssociateDetailsForm } from '@/components/AssociateDetailsForm';
import { useCompany } from '@/components/urql-companies/CompanyClientUrql';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const { company, error, isLoading } = useCompany(params.id);

  console.log('company.plans: ', company?.plans);

  const searchParams = useSearchParams();
  const mode = searchParams.get('mode'); // 'add' or 'edit'

  const isEditing = mode === 'edit';
  // @TODO: validate the form
  const companyForm: UseFormReturn<CompanyFormValues> =
    useForm<CompanyFormValues>({
      resolver: zodResolver(companyFormSchema),
      defaultValues: isEditing
        ? {
            name: 'E-corp',
            companyContactEmail: 'Phillip Price',
            orgNumber: '133742',
            country: 'Sweden',
            city: 'Gothenburg',
            address: 'Vasa Gatan 32',
            pullTestPlan: '',
            xCyclopsPlan: '',
            ultraboltsPlan: '',
            plans: [],
          }
        : {
            name: '',
            companyContactEmail: '',
            orgNumber: '',
            country: '',
            city: '',
            address: '',
            pullTestPlan: '',
            xCyclopsPlan: '',
            ultraboltsPlan: '',
            plans: [],
            // Initialize empty array for the plans
            // assignSandvikAdministrator: '',
          },
    });

  // @TODO Just for testing Add company / Edit company state
  const companyToEditName = 'E-Corp';
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const user = isAdmin ? 'Superadmin' : 'Client';

  const allPlansTypes = [
    { id: 'pull-test', applicationName: 'PULL_TEST' },
    { id: 'xcyclops', applicationName: 'XCYCLOPS' },
    { id: 'ultrabolts', applicationName: 'ULTRABOLTS' },
  ] as const;

  useEffect(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        companyContactEmail: company.companyContactEmail || 'Phillip Price',
        orgNumber: company.orgNumber || '133742',
        country: company.country || 'Sweden',
        city: company.city || 'Gothenburg',
        address: company.address || 'Vasa Gatan 32',
        postalCode: company.postalCode || '',
        pullTestPlan:
          company.plans.find((p) => p.applicationName === 'PULL_TEST')
            ?.planLevel || '',
        xCyclopsPlan:
          company.plans.find((p) => p.applicationName === 'XCYCLOPS')
            ?.planLevel || '',
        ultraboltsPlan:
          company.plans.find((p) => p.applicationName === 'ULTRABOLTS')
            ?.planLevel || '',
        plans: company.plans,
      });
    }
  }, [company]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      {/* disabled for now */}
      {/* <div className="fixed opacity-10 hover:opacity-80 duration-100 ease-linear right-24 top-24 bg-slate-200 p-4 w-56">
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
      </div> */}

      <Headline as="h1" variant="xl" color="foreground">
        {isEditing ? companyToEditName : 'Add Company'}
      </Headline>

      {isEditing && (
        <>
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
        </>
      )}

      <Form {...companyForm}>
        <form
          onSubmit={companyForm.handleSubmit((e) =>
            console.log(e, 'company added'),
          )}
          className="w-full flex flex-row flex-wrap gap-6"
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
                  // look for a matching plan from company data, if not found then create a new plan
                  // if it exists, then use the existingPlan
                  const existingPlan = company.plans.find(
                    (plan) => plan.applicationName === planType.applicationName,
                  );

                  const appPlan = existingPlan || {
                    id: planType.id,
                    applicationName: planType.applicationName,
                    planLevel: undefined,
                    companyId: company.id,
                    expiringDate: '',
                  };

                  return (
                    <AppPlansContainer
                      appPlan={appPlan}
                      key={appPlan.id}
                      isAdmin={isAdmin}
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
        </form>
      </Form>

      <div className="flex flex-col gap-6 items-end self-end mt-[-40px]">
        <Button variant="primary" size="large" type="submit">
          <LucideCircleCheckBig />
          {isEditing ? 'Update company details' : 'Send invitation'}
        </Button>
        {isEditing && (
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
