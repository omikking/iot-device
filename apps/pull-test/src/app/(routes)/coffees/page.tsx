import CoffeeCreateUrql from '@/components/urql-coffees/CoffeeCreateUrql';
import CoffeesClientUrql from '@/components/urql-coffees/CoffeesClientUrql';
import CoffeesUrql from '@/components/urql-coffees/CoffeesUrql';

import type { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <h1 className="text-md">URQL Coffees ☕️</h1>
      <div className="flex flex-col gap-10">
        <CoffeesClientUrql />
        <CoffeesUrql />
        <CoffeeCreateUrql />
      </div>
    </main>
  );
}
