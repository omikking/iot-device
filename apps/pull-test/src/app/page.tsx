import { Headline } from '@gsp/ui';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white">
      <Headline as="h1" variant="xl" color="foreground">
        Pull Test Overview
      </Headline>
    </main>
  );
}
