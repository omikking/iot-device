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
  useMobileNav,
} from '@gsp/ui-banshee';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import { LucideUser, Menu } from 'lucide-react';
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
  const mobileNav = useMobileNav();
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
  // Human-readable page title per route segment. Keyed by the path segment that
  // follows the companyId (deepest known segment wins, e.g. banshee/dashboard).
  const pageTitleBySegment: Record<string, string> = {
    overview: 'Home',
    banshee: 'Banshee',
    dashboard: 'Dashboard',
    scheduler: 'Scheduler',
    events: 'Events',
    siteInformation: 'Site information',
    template: 'Template',
    contactUs: 'Contact us',
    cart: 'Cart',
  };

  // Segments after the companyId, e.g. `/acme/banshee/dashboard/123` -> ['banshee','dashboard','123'].
  const routeSegments = pathname.split('/').filter(Boolean).slice(1);
  const pageTitle = routeSegments.reduce(
    (title, segment) => pageTitleBySegment[segment] ?? title,
    '',
  );

  //TODO Format date and time according to where the user is.
  const today = new Date()
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '.');

  const userNameInitials = (session?.user?.fullName ?? '')
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
      <nav className="ui-banshee-relative ui-banshee-w-full ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between ui-banshee-items-center">
        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3">
          {/* Mobile/Tablet: hamburger toggle for the off-canvas sidebar drawer */}
          {isCompact && status === 'authenticated' && mobileNav && (
            <button
              type="button"
              onClick={mobileNav.toggleMobile}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNav.openMobile}
              aria-haspopup="dialog"
              className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-text-neutral-5 hover:ui-banshee-text-main-black ui-banshee-rounded-md ui-banshee-p-1 ui-banshee-transition-colors focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-gold-primary"
            >
              <Menu size={24} />
            </button>
          )}
          <Link href={`/${companyId}/overview`}>
            <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-1">
              <SandvikLogo />
              {/* Wordmark hidden on mobile to make room for the centered page
                  title; the sidebar drawer carries the wordmark there instead. */}
              <div className="ui-banshee-hidden md:ui-banshee-block ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-black ui-banshee-mx-1" />
              <Headline
                variant="medium"
                color="foreground"
                as="h3"
                isBold
                className="ui-banshee-hidden md:ui-banshee-block"
              >
                BANSHEE
              </Headline>
            </div>
          </Link>
        </div>

        {/* Current page title, centered and route-driven */}
        {status === 'authenticated' && pageTitle && isCompact && (
          <div className="ui-banshee-pointer-events-none ui-banshee-absolute ui-banshee-left-1/2 ui-banshee--translate-x-1/2 ui-banshee-max-w-[40%]">
            <Headline
              variant="small"
              color="foreground"
              as="h2"
              isBold
              className="ui-banshee-truncate ui-banshee-text-center"
            >
              {pageTitle}
            </Headline>
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
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b  ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      New Banshee request
                    </p>
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      {newBansheeCount}
                    </p>
                  </div>
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b  ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      Recurring Banshee request
                    </p>
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      {recurringCount}
                    </p>
                  </div>
                  <div className="ui-banshee-flex ui-banshee-justify-between ui-banshee-gap-6 ui-banshee-py-4 ui-banshee-border-neutral-3 ui-banshee-border-b ui-banshee-w-full">
                    <p className="ui-banshee-w-fit ui-banshee-text-[.9rem]">
                      Total measurement request
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
                      View cart
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
