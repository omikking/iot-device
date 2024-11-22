
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

export class CreateUserPermissionInput {
    userId: string;
    globalRole: string;
    companyRole: string;
    appsAccess: string[];
}

export class UpdateUserPermissionInput {
    oldAdminId: string;
    newAdminId: string;
}

export class CreateCompanyInput {
    name: string;
    orgNumber: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    companyContactEmail: string;
    userPermissions: CreateUserPermissionInput[];
}

export class UpdateCompanyInput {
    name?: Nullable<string>;
    orgNumber?: Nullable<string>;
    address?: Nullable<string>;
    postalCode?: Nullable<string>;
    city?: Nullable<string>;
    country?: Nullable<string>;
    companyContactEmail?: Nullable<string>;
    userPermissions?: Nullable<UpdateUserPermissionInput[]>;
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
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    orgNumber: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    companyContactEmail: string;
    userPermissions?: Nullable<UserPermission[]>;
}

export class UserPermission {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    userId: string;
    globalRole: string;
    companyRole: string;
    appsAccess: string[];
}

export type DateTime = any;
type Nullable<T> = T | null;
