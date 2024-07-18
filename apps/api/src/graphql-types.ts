
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCoffeeInput {
    name: string;
    brand: string;
    flavors: string[];
}

export class UpdateCoffeeInput {
    name?: Nullable<string>;
    brand?: Nullable<string>;
    flavors?: Nullable<string[]>;
}

export class CreateCompanyInput {
    name: string;
    CompanyCode: number;
    country: string;
    city: string;
    address: string;
    users?: Nullable<Nullable<User>[]>;
}

export class UpdateCompanyInput {
    name?: Nullable<string>;
    CompanyCode?: Nullable<number>;
    country?: Nullable<string>;
    city?: Nullable<string>;
    address?: Nullable<string>;
    users?: Nullable<Nullable<User>[]>;
}

export class Coffee {
    id: number;
    name: string;
    brand: string;
    flavors?: Nullable<Flavor[]>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Flavor {
    id: number;
    name: string;
}

export abstract class IQuery {
    coffees: Coffee[];
    coffee?: Coffee;
    companies: Company[];
    company?: Company;
}

export abstract class IMutation {
    createCoffee?: Coffee;
    updateCoffee?: Coffee;
    removeCoffee?: Coffee;
    createCompany?: Company;
    updateCompany?: Company;
    removeCompany?: Company;
}

export class Company {
    id: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    companyCode: number;
    country: string;
    city: string;
    address: string;
    users?: Nullable<Nullable<User>[]>;
}

export class User {
    id: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    companies?: Nullable<Nullable<Company>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
