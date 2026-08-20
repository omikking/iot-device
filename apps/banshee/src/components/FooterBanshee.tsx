'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Text,
  Headline,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
  useIsMobile,
  useIsTablet,
} from '@gsp/ui-core';
import { SandvikLogo } from 'public/SandvikLogo';
import { LucideGlobe } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/overview' },
  { label: 'Banshee', href: '/banshee' },
  { label: 'Schedule', href: '/scheduler' },
  { label: 'Events', href: '/events' },
  { label: 'Settings', href: '/siteInformation' },
  { label: 'Contact Us', href: '/contactUs' },
];

const secondaryLinks = [
  { label: 'Contact', href: '/contactUs' },
  { label: 'Change language', href: '#' },
  { label: 'Trademarks', href: '#' },
  { label: 'Data privacy portal', href: '#' },
  { label: 'Cookie privacy policy', href: '#' },
  { label: 'Report a concern(Speak up)', href: '#' },
];

const legalLinks = [
  { label: 'Terms of Use', href: '#' },
  { label: 'Sandvik Privacy Policy', href: '#' },
  { label: 'Sweden Supply Chains Act', href: '#' },
];

export const FooterBanshee = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isCompact = isMobile || isTablet;

  const params = useParams();
  const companyId = params.companyId as string;

  // Routes are scoped under /[companyId]; prefix internal links with the active
  // companyId and leave placeholder (#) links untouched.
  const withCompany = (href: string) =>
    href === '#' || !companyId ? href : `/${companyId}${href}`;

  if (isCompact) {
    return null;
  }

  return (
    <div className="ui-banshee-bottom-0 ui-banshee-w-full ui-banshee-h-[460px] ui-banshee-z-10 ui-banshee-bg-main-black ui-banshee-text-main-white">
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-h-full ui-banshee-justify-between ui-banshee-pt-16 ui-banshee-pr-36 ui-banshee-pb-5 ui-banshee-pl-16">
        <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between">
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2">
            <SandvikLogo height="32" width="32" fill="white" />
            <Headline variant="large" color="background" as="h2" isBold>
              SANDVIK
            </Headline>
          </div>

          <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-56">
            <div>
              {navLinks.map(({ label, href }) => (
                <Link key={label} href={withCompany(href)}>
                  <Text color="background" variant="medium">
                    {label}
                  </Text>
                </Link>
              ))}
            </div>
            <div>
              {secondaryLinks.map(({ label, href }) => (
                <Link key={label} href={withCompany(href)}>
                  <Text color="background" variant="small">
                    {label}
                  </Text>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="ui-banshee-flex ui-banshee-flex-col">
          <div className="ui-banshee-flex ui-banshee-gap-4 ui-banshee-justify-start ui-banshee-items-center">
            <LucideGlobe size={16} />
            <Text color="background" variant="small">
              Global
            </Text>
            <Headline as="h4" color="background" variant="medium">
              |
            </Headline>
            <Text color="background" variant="small">
              English (US)
            </Text>
          </div>

          <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between ui-banshee-items-center ui-banshee-pt-6">
            <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-10">
              {legalLinks.map(({ label, href }) => (
                <Link key={label} href={withCompany(href)}>
                  <Text color="muted" variant="small">
                    {label}
                  </Text>
                </Link>
              ))}
              <Text color="muted" variant="small">
                © 2024 Sandvik AB. All rights reserved.
              </Text>
            </div>

            <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4">
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
              <LinkedinIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
