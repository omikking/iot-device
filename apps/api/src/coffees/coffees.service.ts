import { Injectable } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { Coffee } from './interface/coffee-data';
import { Flavor } from './interface/flavor-data';

// In Prisma null and undefined are treated differently.
// null is a value that removes the value from the database
// undefined is a value that does not change the value in the database. (leaves it as it is)

// This is why we need to convert null to undefined when we pass the data to Prisma. Unless we WANTED to remove the value from the database.
// GraphQL covers this here: https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#null-and-undefined-in-a-graphql-resolver

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Coffee[]> {
    const coffees = this.prisma.coffee.findMany();
    return coffees;
  }

  async findOne(id: number): Promise<Coffee> {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return coffee;
  }

  async create(createCoffeeInput: CreateCoffeeInput): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeInput.flavors.map((name) => this.preloadFlavorByName(name)),
    );

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

  async update(
    id: number,
    updateCoffeeInput: UpdateCoffeeInput,
  ): Promise<Coffee> {
    const flavors =
      updateCoffeeInput.flavors &&
      (await Promise.all(
        updateCoffeeInput.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.prisma.coffee.update({
      data: {
        name: updateCoffeeInput?.name || undefined,
        brand: updateCoffeeInput?.brand || undefined,
        flavors: {
          create: flavors?.map((flavor) => ({
            flavor: {
              connect: {
                id: flavor.id,
              },
            },
          })),
        },
      },
      where: { id },
    });

    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return coffee;
  }

  async remove(id: number): Promise<Coffee> {
    await this.prisma.coffeeFlavor.deleteMany({
      where: { coffeeId: id },
    });

    const removedCoffee = await this.prisma.coffee.delete({
      where: { id },
    });

    if (!removedCoffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }
    return removedCoffee;
  }

  async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.prisma.flavor.findFirst({
      where: { name },
    });

    if (existingFlavor) {
      return existingFlavor;
    }

    return await this.prisma.flavor.create({
      data: { name },
    });
  }
}
