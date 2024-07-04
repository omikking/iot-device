import CoffeesListClient from '../components/coffees/CoffeesListClient';
import CoffeesList from '../components/coffees/CoffeesList';
import CoffeeItem from '../components/coffees/CoffeeItem';
import CoffeeCreate from '../components/coffees/CoffeeCreate';
export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-around min-h-screen p-24 ">
      <h1 className="text-md">Welcome to Ground Support Web! 🚀</h1>

      <div className="flex flex-col gap-10">
        <CoffeeCreate />
        <CoffeesList />
        <CoffeeItem params={{ id: '2' }} />
        <CoffeesListClient />
      </div>

      <div className="flex flex-col md:flex-row max-w-md w-full"></div>
    </main>
  );
}
