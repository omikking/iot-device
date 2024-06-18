import { Injectable } from '@nestjs/common';
// import * as GraphQLTypes from 'src/graphql-types';
import { UserInputError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoffeeInput } from './dto/create-coffee.input';
// import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { Coffee } from './interface/coffee-data';
import { Flavor } from './interface/flavor-data';
// import * as GraphQLTypes from '../graphql-types';

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Coffee[]> {
    const coffees = this.prisma.coffee.findMany();

    return coffees;

    // const coffeeWithFlavor = await this.prisma.coffee.findMany({
    //   select: {
    //     flavors: {
    //       select: {
    //         flavor: true,
    //       },
    //     },
    //   },
    // });

    // console.log('coffee flavors', coffeeWithFlavor[2].flavors);
  }

  // async findOne(id: number): Promise<Coffee> {
  //   const coffee = await this.prisma.coffee.findUnique({ where: { id } });
  //   if (!coffee) {
  //     throw new UserInputError(`Coffee #${id} does not exist`);
  //   }
  //   return coffee;
  // }

  // This works pls no remove
  // async create(createCoffeeInput: CreateCoffeeInput) {
  //   console.log('heeeeej');
  //   const newCoffee = await this.prisma.coffee.create({
  //     data: {
  //       name: createCoffeeInput.name,
  //       brand: createCoffeeInput.brand,
  //       flavors: {
  //         create: [
  //           {
  //             flavor: {
  //               create: {
  //                 name: 'vanilla',
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });

  //   console.log('the new coffee', newCoffee);

  //   return newCoffee;
  // }

  // async create(createCoffeeInput: CreateCoffeeInput) {
  //   console.log('heeeeej');
  //   console.log('createCoffeeInput', createCoffeeInput.flavors);
  //   const newCoffee = await this.prisma.coffee.create({
  //     data: {
  //       name: createCoffeeInput.name,
  //       brand: createCoffeeInput.brand,
  //       flavors: {
  //         create: [
  //           {
  //             flavor: {
  //               create: {
  //                 name: 'vanilla',
  //               },
  //             },
  //           },
  //           {
  //             flavor: {
  //               create: {
  //                 name: 'Amaretto',
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });

  //   console.log('the new coffee', newCoffee);

  //   return newCoffee;
  // }

  // Latest and greatest
  // async create(createCoffeeInput: CreateCoffeeInput) {
  //   const flavors = await Promise.all(
  //     createCoffeeInput.flavors.map((name) => this.preloadFlavorByName(name)),
  //   );
  //   const coffee = this.prisma.coffee.create({
  //     data: {
  //       name: createCoffeeInput.name,
  //       brand: createCoffeeInput.brand,
  //       flavors: {
  //         create: flavors.map((flavor) => ({
  //           flavor: {
  //             create: {
  //               name: flavor.name,
  //             },
  //           },
  //         })),
  //       },
  //     },
  //   });

  //   return coffee;
  // }

  // This actually works.
  async createnew(createCoffeeInput: CreateCoffeeInput) {
    console.log('heeeeej');
    const newCoffee = await this.prisma.coffee.create({
      data: {
        name: createCoffeeInput.name,
        brand: createCoffeeInput.brand,
        flavors: {
          create: [
            {
              flavor: {
                connectOrCreate: {
                  where: {
                    id: 7,
                  },
                  create: {
                    name: 'vanilla',
                    id: 7,
                  },
                },
              },
            },
            {
              flavor: {
                connectOrCreate: {
                  where: {
                    id: 8,
                  },
                  create: {
                    name: 'chocolate',
                    id: 8,
                  },
                },
              },
            },
          ],
        },
      },
    });

    console.log('the new coffee', newCoffee);

    return newCoffee;
  }

  async create(createCoffeeInput: CreateCoffeeInput): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeInput.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    console.log('flavors', flavors);

    const coffee = await this.prisma.coffee.create({
      data: {
        name: createCoffeeInput.name,
        brand: createCoffeeInput.brand,
        flavors: {
          create: flavors.map((flavor) => ({
            flavor: {
              connect: {
                id: flavor.id,
              },
            },
          })),
        },
      },
    });

    return { ...coffee, flavors };
  }

  // GraphQL kan ge tillbaka NULL!
  // Prisma vill endast ha undefined!!!

  // Behandlar prisma null och undefined annorlunda?
  // async update(
  //   id: number,
  //   updateCoffeeInput: UpdateCoffeeInput,
  // ): Promise<Coffee> {
  //   const coffee = await this.prisma.coffee.update({
  //     data: {
  //       ...updateCoffeeInput,
  //     },
  //     where: { id },
  //   });

  //   if (!coffee) {
  //     throw new UserInputError(`Coffee #${id} does not exist`);
  //   }
  //   return coffee;
  // }

  // Original
  async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.prisma.flavor.findFirst({
      where: { name },
    });

    if (existingFlavor) {
      console.log('Found an existing flavor', existingFlavor);
      return existingFlavor;
    }
    console.log('NOOOOO');
    return await this.prisma.flavor.create({
      data: { name },
    });
  }
  // This will allow GraphQL to send null values which Prisma does not accept, so we need to convert null to undefined.
  // In Prisma null and undefined are treated differently.

  // null is a value that removes the value from the database
  // undefined is a value that does not change the value in the database. (leaves it as it is)

  // This is why we need to convert null to undefined when we pass the data to Prisma. Unless we WANTED to remove the value from the database.

  // GraphQL covers this here: https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#null-and-undefined-in-a-graphql-resolver

  // async remove(id: number): Promise<Coffee> {
  //   const removedCoffee = await this.prisma.coffee.delete({
  //     where: { id },
  //   });
  //   if (!removedCoffee) {
  //     throw new UserInputError(`Coffee #${id} does not exist`);
  //   }
  //   return removedCoffee;
  // }
}
