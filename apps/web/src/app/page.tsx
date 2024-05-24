'use client';
import { Card, Cube, Checkbox, Button } from '@gsp/ui';
import SignInButton from '../components/SignInButton';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-md">Welcome to Ground Support Web! 🚀</h1>
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
      <div className="flex flex-col md:flex-row">
        <Cube>Hello I'm a cube</Cube>
        <Checkbox />
      </div>
      <div className="flex flex-col md:flex-row ">
        <Button className="min-w-40 ">Sign in</Button>
      </div>
    </main>
  );
}
