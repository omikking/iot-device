import { GoBack } from '@/components/GoBack';
import { Badge, Button, Headline, NavigationCard, Text } from '@gsp/ui';
import {
  LucideArrowRight,
  LucideCheckCircle,
  LucideCircuitBoard,
  LucideClipboardCheck,
  LucideMoveRight,
  LucideTriangleAlert,
} from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white max-w-[1400px]">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        Ecorp
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Pull-test overview
      </Headline>

      {/* <div className="flex flex-row max-w-[1000px] w-full pt-20 "> */}
      <div className="flex flex-row flex-wrap gap-12 w-full justify-center">
        <Link href="/">
          <NavigationCard>
            <div className="flex flex-col items-center h-full gap-6 relative">
              <Headline as="h3" variant="medium" color="foreground">
                Bolt results
              </Headline>
              <LucideClipboardCheck />
              <Button variant="secondary" size={'large'}>
                <LucideMoveRight />
                View bolt results
                <Text color={'foreground'} variant={'small'}></Text>
              </Button>
            </div>
          </NavigationCard>
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-12 w-full justify-center">
        <Link href="/">
          <NavigationCard>
            <div className="flex flex-col items-center h-full gap-6 relative">
              <Badge
                className="absolute top-[-25px] right-[-55px] flex border-neutral-3 border"
                variant="neutral"
                size="small"
              >
                5 active
              </Badge>
              <Headline as="h3" variant="medium" color="foreground">
                Hazards
              </Headline>
              <LucideTriangleAlert />
              <Button variant="secondary" size={'large'}>
                <LucideMoveRight />
                View hazards
                <Text color={'foreground'} variant={'small'}></Text>
              </Button>
            </div>
          </NavigationCard>
        </Link>
      </div>
      {/* </div> */}
    </main>
  );
}
