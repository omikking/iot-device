import { Button, Headline, Anchor, Text, Badge } from '@gsp/ui';
import {
  LucideBot,
  LucideChevronDown,
  LucideCircleCheckBig,
  LucideCloudUpload,
  LucideMoveLeft,
  LucideMoveRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-start gap-12 min-h-screen p-24 ">
      <Headline variant="xl" as="h1" color="foreground">
        Design system experiments 🦄
      </Headline>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Buttons 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12">
        <Button variant="primary" size="large">
          <LucideBot size="20" />
        </Button>

        <Button variant="secondary" size="large">
          <LucideBot size="20" />
          Secondary large with icon
        </Button>

        <Button variant="outline" size="large">
          Outline large
        </Button>

        <Button variant="primary" size="large" disabled>
          Disabled large
        </Button>

        <Button variant="destructive" size="large">
          Destructive large
        </Button>

        <Button variant="secondary" size="small">
          <LucideChevronDown size="16" />
        </Button>

        <Button variant="primary" size="small">
          <LucideChevronDown size="16" />
          Primary small with icon
        </Button>

        <Button variant="primary" size="small">
          Primary small
        </Button>

        <Button variant="secondary" size="small">
          Secondary small
        </Button>

        <Button variant="outline" size="small">
          Outline small
        </Button>

        <Button variant="primary" size="small" disabled>
          Disabled small
        </Button>

        <Button variant="destructive" size="small">
          Destructive small
        </Button>

        <Button variant="secondary" size="small" asChild>
          <Link href="#">
            <LucideMoveRight size="16" />
            Button used as link
          </Link>
        </Button>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Headlines 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Headline as="h1" variant="xl" color="foreground">
          XL Headline
        </Headline>

        <Headline as="h2" variant="large" color="destructive">
          Large Headline destructive color
        </Headline>

        <Headline as="h3" variant="medium" color="muted">
          Medium Headline muted color
        </Headline>

        <Headline as="h4" variant="smallBold" color="foreground">
          Small bold Headline
        </Headline>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Texts 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant="medium" color="foreground">
          Medium text
        </Text>

        <Text variant="small" color="destructive">
          Small text with destructive color
        </Text>

        <Text variant="xs" color="muted">
          XS text with muted color
        </Text>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Links 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant="xs" color="foreground">
          <Link href="#" passHref legacyBehavior>
            <Anchor isUnderline color="foreground">
              Link and black underline
            </Anchor>
          </Link>
        </Text>

        <Text variant="medium" color="destructive">
          <Link href="#" passHref legacyBehavior>
            <Anchor isUnderline color="destructive">
              Link and destructive underline
            </Anchor>
          </Link>
        </Text>

        <Headline variant="medium" color="foreground" as="h2">
          <Link href="#" passHref legacyBehavior>
            <Anchor color="foreground">
              <LucideMoveRight />
              Link with icon and no underline
            </Anchor>
          </Link>
        </Headline>

        <Text variant="medium" color="foreground">
          <Link href="#" passHref legacyBehavior>
            <Anchor color="foreground">
              <LucideMoveLeft size="20" />
              Go back
            </Anchor>
          </Link>
        </Text>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Badges 🦄
      </Headline>

      <div className="flex flex-row flex-wrap gap-12">
        <Badge variant="primary">Primary</Badge>

        <Badge variant="attention">Attention</Badge>

        <Badge variant="neutral">Neutral</Badge>

        <Badge variant="destructive">Destructive</Badge>

        <Badge variant="success">Success</Badge>

        <Badge variant="warning">Warning</Badge>

        <Badge variant="primary">
          <LucideCircleCheckBig size="14" />
          Primary with icon
        </Badge>

        <Badge variant="attention">
          <LucideCloudUpload size="14" />
          Attention with icon
        </Badge>

        <Badge variant="neutral">
          <LucideBot size="14" />
        </Badge>

        <Badge variant="primary" size="large">
          Primary large
        </Badge>

        <Badge variant="primary" size="large">
          <LucideBot size="18" />
          Primary large with icon
        </Badge>

        <Badge variant="primary" size="large">
          <LucideBot size="18" />
        </Badge>
      </div>
    </main>
  );
}
