import Link from 'next/link';
import { Button, Text, Headline } from '@gsp/ui';
export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center min-h-screen p-24">
      <Headline as="h1" variant={'xl'} color={'foreground'}>
        Welcome to Ground Support Web! 🦄
      </Headline>

      <div className="py-5">
        <Text variant={'medium'} color={'foreground'}>
          Routes
        </Text>

        <Button size={'large'} variant={'primary'}>
          <Link href="/coffees">Coffees</Link>
        </Button>
      </div>
    </main>
  );
}
