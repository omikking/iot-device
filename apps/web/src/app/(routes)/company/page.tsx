'use client';
import {
  LucideCircleCheckBig,
  LucideMountain,
  LucideMoveRight,
  LucidePyramid,
  LucideSparkles,
  LucideTrash2,
  LucideUsers,
} from 'lucide-react';
import {
  Headline,
  Text,
  ContentHolder,
  Button,
  NavigationCard,
  Form,
} from '@gsp/ui';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appPlansMock } from '@/app/mock/mock';
import { GoBack } from '@/components/GoBack';
import { AdminForm } from '@/components/AdminForm';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { AssociateDetailsForm } from '@/components/AssociateDetailsForm';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

export const companyFormSchema = z.object({
  companyName: z.string(),
  fullContactName: z.string(),
  organisationNumber: z
    .string()
    .min(10, { message: 'Must be 10 numbers.' })
    .max(10, { message: 'Must be 10 numbers.' }),
  country: z.string(),
  city: z.string(),
  address: z.string(),

  pullTestPlan: z.string(),
  xCyclopsPlan: z.string(),
  ultraboltsPlan: z.string(),

  assignSandvikAdministrator: z.string(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function Page(): JSX.Element {
  // @TODO: validate the form
  const companyForm: UseFormReturn<CompanyFormValues> =
    useForm<CompanyFormValues>({
      resolver: zodResolver(companyFormSchema),
      defaultValues: {
        companyName: 'E-corp',
        fullContactName: 'Phillip Price',
        organisationNumber: '133742',
        country: 'Sweden',
        city: 'Gothenburg',
        address: 'Vasa Gatan 32',

        pullTestPlan: '',
        xCyclopsPlan: '',
        ultraboltsPlan: '',

        assignSandvikAdministrator: '',
      },
    });

  // @TODO Just for testing Add company / Edit company state
  const companyToEditName = 'E-Corp';
  // const companyToEditName = false;

  // @TODO Just for testing user type, will be removed
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const user = isAdmin ? 'Superadmin' : 'Client';

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      {/* @TODO TEMPORARY: will be removed */}
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
        {companyToEditName || 'Add company'}
      </Headline>

      {companyToEditName && (
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
                {appPlansMock.map((appPlan) => (
                  <AppPlansContainer
                    appPlan={appPlan}
                    key={appPlan.id}
                    isAdmin={isAdmin}
                  />
                ))}
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
          {companyToEditName ? 'Update company details' : 'Send invitation'}
        </Button>
        <Button
          variant="destructive"
          size="large"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <LucideTrash2 />
          Inactivate company
        </Button>
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
