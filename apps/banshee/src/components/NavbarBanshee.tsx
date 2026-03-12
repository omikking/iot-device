import React from 'react';
import {
  Text,
  Button,
  Avatar,
  Popover,
  Headline,
  AvatarImage,
  PopoverContent,
  PopoverTrigger,
  AvatarFallback,
} from '@gsp/ui-banshee';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';
import { LucideUser } from 'lucide-react';
// TODO fix proper import
import { ShoppingCart } from '../../../../packages/ui-banshee/src/components/svg/shopping-cart';

export const NavbarBanshee = () => {
  //TODO Format date and time according to where the user is.
  const today = new Date()
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '.');

  const time = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <header className="ui-banshee-h-20 ui-banshee-mx-16 ui-banshee-w-[calc(100%-8rem)] ui-banshee-flex ui-banshee-border-b ui-banshee-justify-between ui-banshee-border-gold-3 ui-banshee-bg-white">
      <nav className="ui-banshee-w-full ui-banshee-flex ui-banshee-flex-row ui-banshee-justify-between ui-banshee-items-center">
        <Link href={'/administration-portal'}>
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-[11px]">
            <SandvikLogo />
            <div className="ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-black ui-banshee-mx-1" />
            <Headline variant="medium" color="foreground" as="h3" isBold>
              BANSHEE
            </Headline>
          </div>
        </Link>
        <div className="ui-banshee-flex ui-banshee-gap-6 ui-banshee-items-center">
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4">
            <Link href="/order-summary">
              <ShoppingCart notification={false} />
            </Link>
            <Popover>
              <PopoverTrigger>
                <LucideUser size={24} />
              </PopoverTrigger>
              <PopoverContent
                sideOffset={29}
                align="end"
                alignOffset={-24}
                className="ui-banshee-border-none ui-banshee-shadow-2xl ui-banshee-p-8 ui-banshee-min-w-64"
              >
                <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-4">
                    <div>
                      <Text
                        variant="small"
                        color="foreground"
                        as="p"
                        className="ui-banshee-mt-[-2px]"
                      >
                        Cool Morty
                      </Text>
                      <Text variant="small" color="foreground" as="p">
                        mortyfor@president.now
                      </Text>
                    </div>
                    <div>
                      <Text variant="small" color="foreground" as="p">
                        Dimension C-131
                      </Text>
                      <Text variant="small" color="foreground" as="p">
                        Ricks side kick
                      </Text>
                    </div>
                    <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-gap-4 ui-banshee-pt-2">
                      {/* might be tailwind config that prefix is missing in the WEB 
                      but once this is in project BANSHEE it maybe be resolved */}
                      <Button className="!p-0" variant="ghost">
                        Browse apps
                      </Button>
                      <Button variant="primary">Logut</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-neutral-3" />
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4">
            <Text variant="small" color="foreground" as="p">
              {today}
            </Text>
            <Text variant="small" color="foreground" as="p">
              {time}
            </Text>
          </div>
        </div>
      </nav>
    </header>
  );
};
