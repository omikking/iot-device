import Link from 'next/link';
import { Button } from '@gsp/ui';
export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center min-h-screen p-24">
      <h1 className="text-md">Welcome to Ground Support Web! 🚀</h1>
      <div className="py-5">
        <p>Routes</p>
        <Button size={'large'} variant={'primary'}>
          <Link href="/coffees">Coffees</Link>
        </Button>
      </div>
    </main>
  );
}
