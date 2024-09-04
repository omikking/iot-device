'use client';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import {
  Headline,
  Text,
  Anchor,
  ContentHolder,
  Button,
  NavigationCard,
  Form,
} from '@gsp/ui';
import {
  LucideCircleCheckBig,
  LucideMountain,
  LucideMoveLeft,
  LucideMoveRight,
  LucidePyramid,
  LucideSparkles,
  LucideUsers,
} from 'lucide-react';
import Link from 'next/link';
import { AdminForm } from '@/components/AdminForm';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AssociateDetailsForm } from '@/components/AssociateDetailsForm';
import { useState } from 'react';
import { appPlansMock } from '@/app/mock/mock';

// @TODO finish this later
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
  ultrabotsPlan: z.string(),

  assignSandvikAdministrator: z.string(),
});

export default function Page(): JSX.Element {
  // @TODO: validate the form
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
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
      ultrabotsPlan: '',

      assignSandvikAdministrator: '',
    },
  });

  // Just for testing Add company / Edit company state
  const companyToEditName = 'E-Corp';
  // const companyToEditName = false;

  // Just for testing user type, will be removed
  const [isAdmin, setIsAdmin] = useState(true);
  const user = isAdmin ? 'Superadmin' : 'Client';

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center pt-28 pb-48 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
            Go back
          </Anchor>
        </Link>
      </Text>

      {/* TEMPORARY: will be removed */}
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
                <Link href="#">
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
                <Link href="#">
                  <LucideMoveRight />
                  View site locations
                </Link>
              </Button>
            </NavigationCard>
          </div>

          <hr className="w-full ui-color-gold-3" />
        </>
      )}

      <Form {...companyForm}>
        <form
          onSubmit={companyForm.handleSubmit((e) =>
            console.log(e, 'company added'),
          )}
          className="w-fit flex flex-row flex-wrap gap-6"
        >
          <div className="mt-8 flex flex-col gap-20">
            {/* Company details */}
            <ContentHolder variant="general" headlineText="Company details">
              <CompanyDetailsForm companyForm={companyForm} />
            </ContentHolder>

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
                      className="mt-1 ml-4 ui-underline ui-underline-offset-2"
                    >
                      Call +46 70 174 06 21
                    </Text>
                  </div>
                )}
              </div>

              {/* App plans */}
              <div className="w-full flex justify-between items-start bg-main-white mt-4">
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

      <Button
        variant="primary"
        size="large"
        type="submit"
        className="self-end mt-[-40px]"
      >
        <LucideCircleCheckBig />
        {companyToEditName ? 'Update company details' : 'Send invitation'}
      </Button>
    </main>
  );
}
