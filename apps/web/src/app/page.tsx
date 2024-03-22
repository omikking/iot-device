import { Card } from '@gsp/ui/card';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-4xl text-center font-sandvik-headline">
        Welcome to Ground Support Web! 🚀
      </h1>
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
