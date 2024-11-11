import CoffeesListClient from '@/components/coffees/CoffeesListClient';
import CoffeesList from '@/components/coffees/CoffeesList';
import CoffeeItem from '@/components/coffees/CoffeeItem';
import CoffeeCreate from '@/components/coffees/CoffeeCreate';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <h1 className="text-md">Coffee stuff ☕️</h1>
      <div className="flex flex-col gap-10">
        <CoffeeCreate />
        <CoffeesList />
        <CoffeeItem params={{ id: '1' }} />
        <CoffeesListClient />
      </div>
    </main>
  );
}
