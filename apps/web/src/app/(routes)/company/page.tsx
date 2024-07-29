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
  LucideUsers,
} from 'lucide-react';
import Link from 'next/link';
import { AdminForm } from '@/components/AdminForm';
import { AppPlansContainer } from '@/components/AppPlansContainer';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
  // to validate the form
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: '',
      fullContactName: '',
      organisationNumber: '',
      country: '',
      city: '',
      address: '',

      pullTestPlan: '',
      xCyclopsPlan: '',
      ultrabotsPlan: '',

      assignSandvikAdministrator: '',
    },
  });

  const mockAppPlans = [
    {
      name: 'Pull-test',
      activePlan: 'Gold',
      id: '1',
    },
    {
      name: 'xCyclops',
      activePlan: undefined,
      id: '2',
    },
    {
      name: 'Ultrabots',
      activePlan: 'Bronze',
      id: '3',
    },
  ];

  // Just for testing Add company / Edit company state
  const companyToEditName = 'E-Corp';
  // const companyToEditName = false;

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="#" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft size="20" />
            Go back
          </Anchor>
        </Link>
      </Text>

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
                <Link href="/company">
                  <LucideMoveRight size="16" />
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
                  <LucideMoveRight size="16" />
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
                  <LucideMoveRight size="16" />
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
          <div className="mt-8 flex flex-col gap-16">
            {/* Company details */}
            <ContentHolder variant="general" headlineText="Company details">
              <CompanyDetailsForm companyForm={companyForm} />
            </ContentHolder>

            {/* App plans */}
            <div className="w-full flex justify-between items-start bg-main-white">
              {mockAppPlans.map((appData) => (
                <AppPlansContainer appData={appData} />
              ))}
            </div>

            {/* Admin assignment */}
            <ContentHolder variant="general" headlineText="Admin">
              <AdminForm companyForm={companyForm} />
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
        <LucideCircleCheckBig size="20" />
        Send invitation
      </Button>
    </main>
  );
}
