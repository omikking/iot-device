'use client';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { Headline, Text, Anchor, ContentHolder, Button } from '@gsp/ui';
import { LucideCircleCheckBig, LucideMoveLeft } from 'lucide-react';
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
      name: 'Pull-test',
      id: '3',
    },
  ];

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
        Add company
      </Headline>

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
