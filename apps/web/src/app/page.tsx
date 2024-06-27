import CoffeeClientComponent from '../components/CoffeeClientComponent';
import Coffees from '../components/Coffees';
import SingleCoffee from '../components/SingleCoffee';
import CreateCoffeeForm from '../components/CreateCoffee';
export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-around min-h-screen p-24 ">
      <h1 className="text-md">Welcome to Ground Support Web! 🚀</h1>

      <CreateCoffeeForm />
      <SingleCoffee params={{ id: '2' }} />
      <Coffees />
      <CoffeeClientComponent />

      <div className="flex flex-col md:flex-row max-w-md w-full"></div>
    </main>
  );
}
