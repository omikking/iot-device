import { Headline } from '@gsp/ui';

export default function Page(): JSX.Element {
  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Headline as="h1" variant="xl" color="foreground">
        Pull Test Overview
      </Headline>
    </main>
  );
}
