import { gql, ApolloError } from '@apollo/client';
import { getClient } from '../libs/ApolloClient';

//Should use the 'use client' hook to fetch data from GraphQL on a client component
//This way we can fetch data and render it on the client side

const GET_COFFEE_BY_ID = gql`
  query GetCoffeeWithID($id: ID!) {
    coffee(id: $id) {
      id
      name
      brand
      flavors {
        name
      }
    }
  }
`;

async function SingleCoffee({ params }: { params: { id: string } }) {
  // Not sure what the best approach is for error handling Apollo Client in RSCs.
  // We do not have access to the error object like in useQuery hook, no docs from Apollo.
  let data, error;
  try {
    const response = await getClient().query({
      query: GET_COFFEE_BY_ID,
      variables: { id: params?.id },
    });
    data = response.data;
    console.log('Data from single coffee', data);
  } catch (e) {
    error = e;
    if (e instanceof ApolloError) {
      console.log('Apollo Error:', e.message);
    } else console.log('Error fetching coffee:', e);
  }

  if (error) {
    return <p>Error fetching coffee</p>;
  }

  return (
    <div>
      <h2 className="text-sm">RSC GetCoffeeWithID</h2>
      {data && (
        <div>
          <p>
            {data.coffee.name} by {data.coffee.brand}
          </p>

          {data.coffee.flavors.map(({ name }: any) => (
            <div key={name}>
              <p>{name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SingleCoffee;
