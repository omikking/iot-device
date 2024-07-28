'use client';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import {
  Headline,
  Text,
  Anchor,
  ContentHolder,
  Button,
  NavigationCard,
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
import { CompanyPlanSelection } from '@/components/CompanyPlanSelection';

export default function Page(): JSX.Element {
  const mockAppPlansList = [
    {
      name: 'Pull-test',
      id: '1',
    },
    {
      name: 'xCyclops',
      id: '2',
    },
    {
      name: 'Ultrabots',
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

      {/* @TODO now sure how we should do the form and if they should not be splitted */}
      <div className="mt-8 flex flex-col gap-16">
        <ContentHolder variant="general" headlineText="Company details">
          <CompanyDetailsForm />
        </ContentHolder>

        <div className="w-full flex justify-between items-center bg-main-white">
          {mockAppPlansList.map((appPlan) => (
            <CompanyPlanSelection appPlan={appPlan} />
          ))}
        </div>

        <ContentHolder variant="general" headlineText="Admin">
          <AdminForm />
        </ContentHolder>
      </div>

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
