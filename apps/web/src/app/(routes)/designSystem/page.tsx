import { Button, Headline, Link, Text } from '@gsp/ui';
import {
  LucideBot,
  LucideChevronDown,
  LucideMoveLeft,
  LucideMoveRight,
} from 'lucide-react';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-start gap-12 min-h-screen p-24 ">
      <Headline variant={'xl'} as="h1" color="foreground">
        Design system experiments 🦄
      </Headline>

      <hr className="w-full" />

      <Headline variant={'large'} as="h1" color="foreground">
        Buttons 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12">
        <Button variant="primary" size={'large'}>
          <LucideBot size={'20'} />
        </Button>

        <Button variant="secondary" size={'large'}>
          <LucideBot size={'20'} />
          Secondary large with icon
        </Button>

        <Button variant="outline" size={'large'}>
          Outline large
        </Button>

        <Button variant="disabled" size={'large'}>
          Disabled large
        </Button>

        <Button variant="destructive" size={'large'}>
          Destructive large
        </Button>

        <Button variant="secondary" size={'small'}>
          <LucideChevronDown size={'16'} />
        </Button>

        <Button variant="primary" size={'small'}>
          <LucideChevronDown size={'16'} />
          Primary small with icon
        </Button>

        <Button variant="primary" size={'small'}>
          Primary small
        </Button>

        <Button variant="secondary" size={'small'}>
          Secondary small
        </Button>

        <Button variant="outline" size={'small'}>
          Outline small
        </Button>

        <Button variant="disabled" size={'small'}>
          Disabled small
        </Button>

        <Button variant="destructive" size={'small'}>
          Destructive small
        </Button>
      </div>

      <hr className="w-full" />

      <Headline variant={'large'} as="h1" color="foreground">
        Headlines 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Headline as="h1" variant={'xl'} color="foreground">
          XL Headline
        </Headline>

        <Headline as="h2" variant={'large'} color="destructive">
          Large Headline destructive color
        </Headline>

        <Headline as="h3" variant={'medium'} color="muted">
          Medium Headline muted color
        </Headline>

        <Headline as="h4" variant={'smallBold'} color="foreground">
          Small bold Headline
        </Headline>
      </div>

      <hr className="w-full" />

      <Headline variant={'large'} as="h1" color="foreground">
        Texts 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant={'medium'} color={'foreground'}>
          Medium text
        </Text>

        <Text variant={'small'} color={'destructive'}>
          Medium text with destructive color
        </Text>

        <Text variant={'xs'} color={'muted'}>
          Medium text with muted color
        </Text>
      </div>

      <hr className="w-full" />

      <Headline variant={'large'} as="h1" color="foreground">
        Links 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant={'xs'} color={'foreground'}>
          <Link isUnderline href="#" color={'foreground'}>
            Link and black underline
          </Link>
        </Text>

        <Text variant={'medium'} color={'destructive'}>
          <Link isUnderline href="#" color={'destructive'}>
            Link and destructive underline
          </Link>
        </Text>

        <Headline variant={'medium'} color={'foreground'} as="h2">
          <Link href="#" color={'foreground'}>
            <LucideMoveRight />
            Link with icon and no underline
          </Link>
        </Headline>

        <Text variant={'medium'} color={'foreground'}>
          <Link href="#" color={'foreground'}>
            <LucideMoveLeft size={'20'} />
            Go back
          </Link>
        </Text>
      </div>
    </main>
  );
}
