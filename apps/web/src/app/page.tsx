'use client';
import { Card } from '@gsp/ui/card';
import SignInButton from './components/SignInButton';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-3xl">
        Welcome to Ground Support Web! 🚀 WHATS GOING ON ok ok ok
      </h1>

      <h1 className="body-intro">Body Intro</h1>
      <h1 className="text-3xl">3 XL</h1>
      <h1 className="text-2xl">2 XL</h1>
      <h1 className="text-xl">XL</h1>
      <h1 className="text-lg">LG</h1>
      <h1 className="text-md">MD</h1>
      <h1 className="text-sm">SM</h1>
      <h1 className="text-xs">XS</h1>

      <SignInButton />
      <div className="flex flex-col md:flex-row">
        <Card href="https://www.home.sandvik/" title="Here is a card">
          A component from the UI package.
        </Card>
        <Card
          href="https://www.home.sandvik/en/about-us/sandvik-at-a-glance/"
          title="This is another card"
        >
          Another component from the UI package.
        </Card>
      </div>
    </main>
  );
}
