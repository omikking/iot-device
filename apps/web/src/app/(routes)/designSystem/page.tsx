import { Button } from '@gsp/ui';
import { LucideBot, LucideChevronDown } from 'lucide-react';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-start gap-12 min-h-screen p-24 ">
      <h1 className="text-md">Design system experiments ☕️</h1>

      <div className="flex flex-row flex-wrap gap-12">
        <Button variant="secondary" size={'small'} type="submit">
          <LucideChevronDown size={'16'} />
        </Button>

        <Button size={'small'} type="submit">
          <LucideChevronDown size={'16'} />
          Primary small with icon
        </Button>

        <Button variant="secondary" type="submit">
          <LucideBot size={'20'} />
        </Button>

        <Button variant="secondary" type="submit">
          <LucideBot size={'20'} />
          Secondary large with icon
        </Button>

        <Button variant="outline" type="submit">
          Outline large
        </Button>

        <Button variant="disabled" type="submit">
          Disabled large
        </Button>

        <Button variant="destructive" type="submit">
          Destructive large
        </Button>

        <Button variant="primary" type="submit" size={'small'}>
          Primary small
        </Button>

        <Button variant="secondary" type="submit" size={'small'}>
          Secondary small
        </Button>

        <Button variant="outline" type="submit" size={'small'}>
          Outline small
        </Button>

        <Button variant="disabled" type="submit" size={'small'}>
          Disabled small
        </Button>

        <Button variant="destructive" type="submit" size={'small'}>
          Destructive small
        </Button>
      </div>
    </main>
  );
}
