import { Headline } from '@gsp/ui-banshee';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Headline as="h1" variant={'large'} color={'foreground'}>
        Banshee App
      </Headline>
      <h1 className="text-4xl ui-banshee-font-bold">Banshee App</h1>
      <p className="text-lg">Welcome to Banshee</p>
    </main>
  );
}

// import { redirect } from 'next/navigation';

// export default function Home() {
//   redirect('/api/auth/signin');
// }
