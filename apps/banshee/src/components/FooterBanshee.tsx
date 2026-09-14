'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Text,
  Headline,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  FacebookIcon,
  useIsMobile,
  useIsTablet,
} from '@gsp/ui-banshee';
import { SandvikLogo } from 'public/SandvikLogo';
import { ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/overview' },
  { label: 'Banshee', href: '/banshee' },
  { label: 'Scheduler', href: '/scheduler' },
  { label: 'Events', href: '/events' },
  { label: 'Site information', href: '/siteInformation' },
  { label: 'Template', href: '/template' },
  { label: 'Contact us', href: '/contactUs' },
];

const secondaryLinks = [
  { label: 'Contact', href: 'https://www.home.sandvik/en/contact/' },
  {
    label: 'Data privacy portal',
    href: 'https://www.home.sandvik/en/about-this-site/data-privacy/',
  },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/sandvik',
    Icon: LinkedinIcon,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/sandvikgroup',
    Icon: InstagramIcon,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@SandvikGroup',
    Icon: YoutubeIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/sandvik',
    Icon: FacebookIcon,
  },
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

          <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-48">
            <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-1">
              {navLinks.map(({ label, href }) => (
                <Link key={label} href={withCompany(href)}>
                  <Text color="background" variant="medium">
                    {label}
                  </Text>
                </Link>
              ))}
            </div>
            <div className="ui-banshee-flex ui-banshee-gap-2 ui-banshee-flex-col">
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

        <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6">
          <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="ui-banshee-group"
              >
                <Icon
                  width={42}
                  height={42}
                  className="
            ui-banshee-transition-all
            ui-banshee-duration-200
            group-hover:ui-banshee-invert
          "
                />
              </a>
            ))}
          </div>
          <hr className="ui-banshee-border-0 ui-banshee-border-t-2 ui-banshee-border-white/20" />

          <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between ui-banshee-items-center">
            <Text color="muted" variant="small">
              © 2026 Copyright © Sandvik AB; (publ) Box 510, SE-101 30
              Stockholm, Sweden Phone: +46 8 456 11 00
            </Text>
            <Link
              href="https://www.home.sandvik/en/websites/"
              className="ui-banshee-group ui-banshee-flex ui-banshee-gap-1"
            >
              <Text
                color="background"
                variant="small"
                className="ui-banshee-underline ui-banshee-underline-offset-2"
              >
                Other Sandvik websites
              </Text>

              <ArrowRight
                size={20}
                className="
                  ui-banshee-translate-x-0
                  ui-banshee-transition-transform
                  ui-banshee-duration-200
                  ui-banshee-ease-in-out
                  group-hover:ui-banshee-translate-x-1
                  group-focus:ui-banshee-translate-x-1
                  group-active:ui-banshee-translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
