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
import { ShoppingCart } from '../../../../../packages/ui-banshee/src/components/svg/shopping-cart';

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
    <header className="h-20 mx-16 w-[calc(100%-8rem)] flex border-b justify-between border-gold-3 bg-white ">
      <nav className="w-full flex flex-row justify-between items-center">
        <Link href={'/administration-portal'}>
          <div className="flex items-center justify-center gap-2">
            <SandvikLogo />
            <div className="h-6 border-l border-black mx-1" />
            <Headline variant="medium" color="foreground" as="h3" isBold>
              BANSHEE
            </Headline>
          </div>
        </Link>
        <div className="flex gap-6 items-center">
          <div className="flex items-center justify-center gap-4 ">
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
                className="border-none shadow-2xl p-8 min-w-64"
              >
                <div className="flex flex-row gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Text
                        variant="small"
                        color="foreground"
                        as="p"
                        className="mt-[-2px]"
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
                    <div className="flex flex-row gap-4 pt-2">
                      {/* might be tailwind config that prefix is missing in the WEB 
                      but once this is in project BANSHEE it maybe be resolved */}
                      <Button className="!p-0" variant="outline">
                        Browse apps
                      </Button>
                      <Button variant="primary">Logut</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-6 border-l border-neutral-3" />
          <div className="flex items-center justify-center gap-4">
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
