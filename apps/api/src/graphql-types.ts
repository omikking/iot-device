
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateBoltResultInput {
    boltNumber: number;
    boltType: string;
    peakLoad: number[];
    peakDisplacement: number[];
    positionInRing: string;
    result: string;
    isHazard: boolean;
    abortReason?: Nullable<string>;
    comment?: Nullable<string>;
    image?: Nullable<string>;
    siteId: string;
    levelId: string;
    driveId: string;
    locationId: string;
    userId: string;
}

export class UpdateBoltResultInput {
    boltNumber?: Nullable<number>;
    boltType?: Nullable<string>;
    peakLoad?: Nullable<number[]>;
    peakDisplacement?: Nullable<number[]>;
    positionInRing?: Nullable<string>;
    result?: Nullable<string>;
    isHazard?: Nullable<boolean>;
    hazardCompletedDate?: Nullable<DateTime[]>;
    abortReason?: Nullable<string>;
    comment?: Nullable<string>;
    image?: Nullable<string>;
}

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
    address: string;
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
    address?: Nullable<string>;
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

export class CreateDriveInput {
    driveName: string;
    levelId: string;
}

export class UpdateDriveInput {
    driveName?: Nullable<string>;
}

export class CreateLevelInput {
    levelName: string;
    siteId: string;
}

export class UpdateLevelInput {
    levelName?: Nullable<string>;
}

export class CreateLocationInput {
    locationName: string;
    driveId: string;
}

export class UpdateLocationInput {
    locationName?: Nullable<string>;
}

export class CreateSiteInput {
    siteName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    companyId: string;
}

export class UpdateSiteInput {
    siteName?: Nullable<string>;
    address?: Nullable<string>;
    postalCode?: Nullable<string>;
    city?: Nullable<string>;
    country?: Nullable<string>;
    companyId: string;
}

export class UpdateUserInput {
    email?: Nullable<string>;
    fullName?: Nullable<string>;
    workPlace?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    globalRole?: Nullable<string>;
    isGlobalVisibility?: Nullable<boolean>;
}

export class BoltResult {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    boltNumber: number;
    boltType: string;
    peakLoad: number[];
    peakDisplacement: number[];
    positionInRing: string;
    result: string;
    isHazard: boolean;
    hazardCompletedDate?: Nullable<DateTime[]>;
    abortReason?: Nullable<string>;
    comment?: Nullable<string>;
    image?: Nullable<string>;
    siteId: string;
    levelId: string;
    driveId: string;
    locationId: string;
    userId: string;
}

export abstract class IQuery {
    boltResults: BoltResult[];
    boltResult?: BoltResult;
    coffees: Coffee[];
    coffee?: Coffee;
    companies: Company[];
    company?: Company;
    drives: Drive[];
    drive?: Drive;
    levels: Level[];
    level?: Level;
    locations: Location[];
    location?: Location;
    sites: Site[];
    site?: Site;
    users?: User[];
    user?: User;
}

export abstract class IMutation {
    createBoltResult?: BoltResult;
    updateBoltResult?: BoltResult;
    removeBoltResult?: BoltResult;
    createCoffee?: Coffee;
    updateCoffee?: Coffee;
    removeCoffee?: Coffee;
    createCompany?: Company;
    updateCompany?: Company;
    removeCompany?: Company;
    createDrive?: Drive;
    updateDrive?: Drive;
    removeDrive?: Drive;
    createLevel?: Level;
    updateLevel?: Level;
    removeLevel?: Level;
    createLocation?: Location;
    updateLocation?: Location;
    removeLocation?: Location;
    createSite?: Site;
    updateSite?: Site;
    removeSite?: Site;
    updateUser?: User;
    removeUser?: User;
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

export class Drive {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    driveName: string;
    levelId: string;
    locations?: Nullable<Location[]>;
    boltResults?: Nullable<BoltResult[]>;
}

export class Level {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    levelName: string;
    siteId: string;
    drives?: Nullable<Drive[]>;
    boltResults?: Nullable<BoltResult[]>;
}

export class Location {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    locationName: string;
    driveId: string;
    boltResults?: Nullable<BoltResult[]>;
}

export class Site {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    siteName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    companyId: string;
    levels?: Nullable<Level[]>;
    boltResults?: Nullable<BoltResult[]>;
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
    userPermissions?: Nullable<UserPermission[]>;
}

export class UserPermission {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    userId: string;
    role: string;
    appsAccess?: Nullable<string[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
