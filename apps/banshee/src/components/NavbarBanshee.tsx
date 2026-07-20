'use client';
import {
  Text,
  Button,
  Avatar,
  Popover,
  Headline,
  PopoverContent,
  PopoverTrigger,
  AvatarFallback,
  useIsMobile,
  useIsTablet,
} from '@gsp/ui-banshee';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import { LucideUser } from 'lucide-react';
// TODO fix proper import
import { ShoppingCart } from '../../../../packages/ui-banshee/src/components/svg/shopping-cart';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useParams } from 'next/navigation';
import { graphql } from '@/gql/gql';
import { useQuery } from 'urql';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { useEffect, useState } from 'react';
import { handleGraphQLErrors } from '@/libs/utils';
const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);

const cartItemsStatsQuery = graphql(`
  query cartItemsStats($companyId: String!) {
    cartItemsStats(companyId: $companyId) {
      newBanshee
      serviceExisting
      total
    }
  }
`);
export const NavbarBanshee = () => {
  const { data: session, status } = useSession();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const router = useCompanyRouter();
  const isCompact = isMobile || isTablet;
  const pathname = usePathname();
  // Navigation items (same as sidebar)
  const params = useParams();
  const companyId = params.companyId as string;
  const [{ data, error: companyNameError }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
    pause: !companyId,
  });

  useEffect(() => {
    handleGraphQLErrors(companyNameError);
  }, [companyNameError]);

  const companyName = data?.company?.name;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [{ data: cartStatsData, error: cartStatsError }, refetchCartStats] =
    useQuery({
      query: cartItemsStatsQuery,
      variables: { companyId },
      pause: !companyId,
    });

  useEffect(() => {
    handleGraphQLErrors(cartStatsError);
  }, [cartStatsError]);
  const newBansheeCount = cartStatsData?.cartItemsStats.newBanshee ?? 0;
  const recurringCount = cartStatsData?.cartItemsStats.serviceExisting ?? 0;
  const totalCount = cartStatsData?.cartItemsStats.total ?? 0;
  const navItems = [
    { title: 'Home', url: `/${companyId}/overview` },
    { title: 'Banshee', url: `/${companyId}/banshee` },
    { title: 'Scheduler', url: `/${companyId}/scheduler` },
    { title: 'Events', url: `/${companyId}/events` },
    { title: 'Site Information', url: `/${companyId}/siteInformation` },
    { title: 'Template', url: `/${companyId}/template` },
    { title: 'Contact Us', url: `/${companyId}/contactUs` },
  ];

  //TODO Format date and time according to where the user is.
  const today = new Date()
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '.');

  const userNameInitials = session?.user?.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    );
  }, []);

  return (
    <header className="ui-banshee-h-20 ui-banshee-mx-4 md:ui-banshee-mx-8 lg:ui-banshee-mx-16 ui-banshee-w-[calc(100%-2rem)] md:ui-banshee-w-[calc(100%-4rem)] lg:ui-banshee-w-[calc(100%-8rem)] ui-banshee-flex ui-banshee-border-b ui-banshee-justify-between ui-banshee-border-gold-3 ui-banshee-bg-white">
      <nav className="ui-banshee-w-full ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between ui-banshee-items-center">
        <Link href={`/${companyId}/overview`}>
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-1">
            <SandvikLogo />
            <div className="ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-black ui-banshee-mx-1" />
            <Headline variant="medium" color="foreground" as="h3" isBold>
              BANSHEE
            </Headline>
          </div>
        </Link>

        {/* Mobile/Tablet Navigation - Icons */}
        {isCompact && status === 'authenticated' && (
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2 md:ui-banshee-gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-px-2 ui-banshee-py-1 ui-banshee-text-xs ui-banshee-rounded-md ui-banshee-transition-colors ${
                    isActive
                      ? 'ui-banshee-text-main-black ui-banshee-font-medium ui-banshee-border-b-2 ui-banshee-border-gold-primary ui-banshee-pb-1'
                      : 'ui-banshee-text-neutral-5 hover:ui-banshee-text-main-black'
                  }`}
                  title={item.title}
                >
                  <Text color="foreground" variant="medium">
                    {item.title}
                  </Text>
                </Link>
              );
            })}
          </div>
        )}

        {status === 'authenticated' && (
          <div className="ui-banshee-flex ui-banshee-gap-6 ui-banshee-items-center">
            <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4">
              <Popover
                open={isCartOpen}
                onOpenChange={(open) => {
                  setIsCartOpen(open);
                  if (open && companyId) {
                    refetchCartStats({ requestPolicy: 'network-only' });
                  }
                }}
              >
                <PopoverTrigger>
                  <ShoppingCart notification={totalCount > 0} />
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={29}
                  align="end"
                  alignOffset={-24}
                   onOpenAutoFocus={(e) => e.preventDefault()}
                  className="ui-banshee-border-none ui-banshee-shadow-2xl ui-banshee-p-8 ui-banshee-pb-4 ui-banshee-min-w-64 ui-banshee-w-fit"
                >
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b  ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      New Banshee Request
                    </p>
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      {newBansheeCount}
                    </p>
                  </div>
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b  ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      Recurring Banshee Request
                    </p>
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      {recurringCount}
                    </p>
                  </div>
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-gap-6 ui-banshee-py-4 ui-banshee-border-[#DADADA] ui-banshee-border-b ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      Total Measurement Request
                    </p>
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      {totalCount}
                    </p>
                  </div>
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-gap-6 ui-banshee-py-2 ui-banshee-flex-row-reverse ui-banshee-w-full">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/cart');
                      }}
                    >
                      View Cart
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger>
                  <LucideUser size={24} />
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={29}
                  align="end"
                  alignOffset={-24}
                  className="ui-banshee-border-none ui-banshee-shadow-2xl ui-banshee-p-8 ui-banshee-min-w-64 ui-banshee-w-fit"
                >
                  <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4 ui-banshee-w-fit">
                    <Avatar>
                      <AvatarFallback>{userNameInitials}</AvatarFallback>
                    </Avatar>
                    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-4">
                      <div>
                        <Text
                          variant="small"
                          color="foreground"
                          as="p"
                          className="ui-banshee-mt-[-2px]"
                        >
                          {session?.user?.fullName}
                        </Text>
                        <Text variant="small" color="foreground" as="p">
                          {session?.user?.email}
                        </Text>
                      </div>
                      <div>
                        <Text variant="small" color="foreground" as="p">
                          {companyName}
                        </Text>
                      </div>
                      <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4 ui-banshee-pt-2">
                        {/* might be tailwind config that prefix is missing in the WEB 
                      but once this is in project BANSHEE it maybe be resolved */}
                        <Button
                          variant="outline"
                          className="
                            !ui-banshee-p-0
                            hover:!ui-banshee-bg-transparent
                            hover:-ui-banshee-translate-y-px
                            active:ui-banshee-translate-y-px                          "
                          onClick={() => {
                            window.location.href = `${process.env.NEXT_PUBLIC_PORTAL_URL}/select-application/${companyId}`;
                          }}
                        >
                          Browse apps
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() =>
                            signOut({ callbackUrl: '/api/auth/signin' })
                          }
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="ui-banshee-hidden md:ui-banshee-block ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-neutral-3" />
            <div className="ui-banshee-hidden md:ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4">
              <Text variant="small" color="foreground" as="p">
                {today}
              </Text>
              <Text variant="small" color="foreground" as="p">
                {time}
              </Text>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
