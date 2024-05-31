'use client';
import { useSession } from 'next-auth/react';
export default function Page(): JSX.Element {
  const { data: session, status } = useSession();
  console.log('Status from sign in page: ', status);
  return (
    <main className="flex flex-col items-center justify-around p-24 ">
      <h1 className="text-md">Welcome to Ground Support Web! 🦄</h1>

      <div className="flex flex-col md:flex-row max-w-md w-full"></div>
    </main>
  );
}
