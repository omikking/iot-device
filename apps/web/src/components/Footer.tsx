import React from 'react';
import {
  Text,
  Headline,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
} from '@gsp/ui-banshee';
import { SandvikLogo } from 'public/SandvikLogo';
import { LucideGlobe } from 'lucide-react';
import { FacebookIcon } from '@gsp/ui-banshee';

export const Footer = () => {
  return (
    <div className="sticky bottom-0 w-full h-[460px] z-10 bg-main-black text-main-white">
      <div className="flex flex-col h-full justify-between pt-16 pr-36 pb-5 pl-16">
        <div className="flex flex-row justify-between ">
          <div>
            <div className="flex items-center gap-2">
              <SandvikLogo height="32" width="32" fill="white" />
              <Headline variant="large" color="background" as="h2" isBold>
                SANDVIK
              </Headline>
            </div>
          </div>
          <div className="flex flex-row gap-56">
            <div className="">
              <Text color="background" variant={'medium'}>
                Home
              </Text>
              <Text color="background" variant={'medium'}>
                Banshee
              </Text>
              <Text color="background" variant={'medium'}>
                Schedule
              </Text>
              <Text color="background" variant={'medium'}>
                Events
              </Text>
              <Text color="background" variant={'medium'}>
                Settings
              </Text>
              <Text color="background" variant={'medium'}>
                Contact Us
              </Text>
            </div>
            <div className="">
              <Text color="background" variant={'small'}>
                Contact
              </Text>
              <Text color="background" variant={'small'}>
                Change language
              </Text>
              <Text color="background" variant={'small'}>
                Trademarks
              </Text>
              <Text color="background" variant={'small'}>
                Data privacy portal
              </Text>
              <Text color="background" variant={'small'}>
                Cookie privacy policy
              </Text>
              <Text color="background" variant={'small'}>
                Report a concern(Speak up)
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <LucideGlobe size={16} />
            <Text color="background" variant={'small'}>
              Global
            </Text>
            <Headline as="h4" color="background" variant={'medium'}>
              |
            </Headline>
            <Text color="background" variant={'large'}></Text>
            <Text color="background" variant={'small'}>
              English(US)
            </Text>
          </div>
          <div className="flex flex-row justify-between pt-6">
            <div className="flex flex-row gap-10">
              <Text color="muted" variant={'small'}>
                Terms of Use
              </Text>
              <Text color="muted" variant={'small'}>
                Sandvik Privacy Policy
              </Text>
              <Text color="muted" variant={'small'}>
                Sweden Supply Chains Act
              </Text>
              <Text color="muted" variant={'small'}>
                © 2024 Sandvik AB. All rights reserved.
              </Text>
            </div>
            <div className="flex flex-row gap-4">
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
              <LinkedinIcon />
              {/* <Text color="background" variant={'small'}>
                L1
              </Text> */}
              {/* <Text color="background" variant={'small'}>
                L2
              </Text> */}
              {/* <Text color="background" variant={'small'}>
                L3
              </Text>
              <Text color="background" variant={'small'}>
                L4
              </Text> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
