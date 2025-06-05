
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    COMPANY_USER = "COMPANY_USER",
    COMPANY_ADMIN = "COMPANY_ADMIN",
    SANDVIK_ADMIN = "SANDVIK_ADMIN",
    SANDVIK_TECHNICIAN = "SANDVIK_TECHNICIAN"
}

export enum Result {
    PASS = "PASS",
    FAIL = "FAIL",
    ABORT = "ABORT"
}

export enum BoltType {
    MD47 = "MD47",
    MDX47 = "MDX47"
}

export enum RingPosition {
    RH_BACKS = "RH_BACKS",
    RH_SHOULDER = "RH_SHOULDER",
    RH_WALL_UPPER = "RH_WALL_UPPER",
    LH_BACKS = "LH_BACKS",
    LH_SHOULDER = "LH_SHOULDER",
    LH_WALL_UPPER = "LH_WALL_UPPER",
    CENTER_BACKS = "CENTER_BACKS"
}

export enum PullTestAbortReason {
    NOT_TESTED_VOID_CAVITY = "NOT_TESTED_VOID_CAVITY",
    TEST_STOPPED_INSTALL_ANGLE = "TEST_STOPPED_INSTALL_ANGLE"
}

export enum Application {
    PULL_TEST = "PULL_TEST",
    PULL_TEST_OPERATOR = "PULL_TEST_OPERATOR",
    XCYCLOPS = "XCYCLOPS",
    ULTRABOLTS = "ULTRABOLTS"
}

export enum PlanLevel {
    GOLD = "GOLD",
    SILVER = "SILVER",
    BRONZE = "BRONZE",
    INACTIVE = "INACTIVE"
}

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
    id?: Nullable<string>;
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
    userPermissions: CreateAdminPermissionInput[];
    plans?: Nullable<CreatePlanInput[]>;
}

export class CreateAdminPermissionInput {
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
    userPermissions?: Nullable<UpdateAdminPermissionInput[]>;
    plans?: Nullable<UpdatePlanInput[]>;
}

export class UpdatePlanInput {
    id?: Nullable<string>;
    applicationName: string;
    planLevel?: Nullable<string>;
    expiringDate?: Nullable<DateTime>;
}

export class UpdateAdminPermissionInput {
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

export class CreateUserPermissionInput {
    userEmail: string;
    role: string;
    appsAccess: string[];
    companyId: string;
}

export class UpdateUserPermissionInput {
    role?: Nullable<string>;
    appsAccess?: Nullable<string[]>;
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
    site?: Nullable<Site>;
    level?: Nullable<Level>;
    drive?: Nullable<Drive>;
    location?: Nullable<Location>;
}

export class BoltResultResponse {
    totalRecords: number;
    results: BoltResult[];
}

export abstract class IQuery {
    boltResults?: BoltResultResponse;
    boltResult?: BoltResult;
    coffees: Coffee[];
    coffee?: Coffee;
    companies?: CompanyListResponse;
    company?: Company;
    drives: Drive[];
    drive?: Drive;
    getRoles: Role[];
    getResults: Result[];
    getBoltTypes?: Nullable<BoltType[]>;
    getRingPosition?: Nullable<RingPosition[]>;
    getPullTestAbortReason?: Nullable<PullTestAbortReason[]>;
    getApplication?: Nullable<Application[]>;
    getPlanLevel?: Nullable<PlanLevel[]>;
    hazards?: Nullable<BoltResult[]>;
    levels: Level[];
    level?: Level;
    locations: Location[];
    location?: Location;
    sites: Site[];
    site?: Site;
    userPermissions: UserPermission[];
    userPermission?: UserPermission;
    users?: User[];
    user?: User;
}

export abstract class IMutation {
    createBoltResult?: BoltResult;
    updateBoltResult?: BoltResult;
    removeBoltResult?: BoltResult;
    createBoltResults?: BoltResult[];
    updateBoltResults?: BoltResult[];
    removeBoltResults?: BoltResult[];
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
    createUserPermission?: UserPermission;
    updateUserPermission?: UserPermission;
    removeUserPermission?: UserPermission;
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

export class CompanyListResponse {
    totalRecords: number;
    results: Company[];
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

export class UserPermission {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    userId: string;
    role: string;
    appsAccess: string[];
    companyId: string;
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

export type DateTime = any;
type Nullable<T> = T | null;
