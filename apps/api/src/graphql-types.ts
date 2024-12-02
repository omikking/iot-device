
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
    orgNumber: string;
    adress: string;
    postalCode: string;
    city: string;
    country: string;
    companyContactEmail: string;
    userPermissions: CreateUserPermissionInput[];
    plans?: Nullable<CreatePlanInput[]>;
}

export class CreateUserPermissionInput {
    userId: string;
}

export class CreatePlanInput {
    applicationName: string;
    planLevel: string;
    expiringDate?: Nullable<DateTime>;
}

export class UpdateCompanyInput {
    name?: Nullable<string>;
    orgNumber?: Nullable<string>;
    adress?: Nullable<string>;
    postalCode?: Nullable<string>;
    city?: Nullable<string>;
    country?: Nullable<string>;
    companyContactEmail?: Nullable<string>;
    userPermissions?: Nullable<UpdateUserPermissionInput[]>;
    plans?: Nullable<UpdatePlanInput[]>;
}

export class UpdatePlanInput {
    id: string;
    applicationName: string;
    planLevel?: Nullable<string>;
    expiringDate?: Nullable<DateTime>;
}

export class UpdateUserPermissionInput {
    oldUserId: string;
    newUserId: string;
}

export class CreateSiteInput {
    siteName: string;
    orgNumber: string;
    adress: string;
    postalCode: string;
    city: string;
    country: string;
    companyId: string;
}

export class UpdateSiteInput {
    siteName?: Nullable<string>;
    orgNumber?: Nullable<string>;
    adress?: Nullable<string>;
    postalCode?: Nullable<string>;
    city?: Nullable<string>;
    country?: Nullable<string>;
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
    adress: string;
    postalCode: string;
    city: string;
    country: string;
    companyContactEmail: string;
    users?: Nullable<User[]>;
    plans?: Nullable<Plan[]>;
    sites?: Nullable<Site[]>;
}

export class Plan {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    companyId: string;
    applicationName: string;
    planLevel: string;
    expiringDate?: Nullable<DateTime>;
}

export class User {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    email: string;
    fullName: string;
    workPlace: string;
    phoneNumber?: Nullable<string>;
    globalRole?: Nullable<string>;
    isGlobalVisibility?: Nullable<boolean>;
    userPermission?: Nullable<UserPermission[]>;
}

export class UserPermission {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    userId: string;
    role: string;
    appsAccess?: Nullable<string[]>;
}

export class Site {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    siteName: string;
    adress: string;
    postalCode: string;
    city: string;
    country: string;
    companyId: string;
    levels?: Nullable<Level[]>;
    boltResults?: Nullable<BoltResult[]>;
}

export class Level {
    levelName: string;
}

export class BoltResult {
    boltNumber: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
