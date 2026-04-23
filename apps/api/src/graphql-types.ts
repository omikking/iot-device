
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
    D47_MD_1_8_M = "D47_MD_1_8_M",
    D47_MD_2_1_M = "D47_MD_2_1_M",
    D47_MD_2_4_M = "D47_MD_2_4_M",
    D47_MD_3_0_M = "D47_MD_3_0_M",
    D47_MD_3_8_M = "D47_MD_3_8_M",
    D47_MDX_1_8_M = "D47_MDX_1_8_M",
    D47_MDX_2_1_M = "D47_MDX_2_1_M",
    D47_MDX_2_4_M = "D47_MDX_2_4_M",
    D47_MDX_3_0_M = "D47_MDX_3_0_M",
    D47_MDX_3_8_M = "D47_MDX_3_8_M",
    D47_MDX_4_0_M = "D47_MDX_4_0_M",
    D39_MDX_1_8_M = "D39_MDX_1_8_M",
    D39_MDX_2_1_M = "D39_MDX_2_1_M",
    D39_MDX_2_4_M = "D39_MDX_2_4_M",
    D39_MDX_3_0_M = "D39_MDX_3_0_M",
    D47_MDX_PEG_BOLT_1_8_M = "D47_MDX_PEG_BOLT_1_8_M",
    D47_MDX_PEG_BOLT_2_1_M = "D47_MDX_PEG_BOLT_2_1_M",
    D47_MDX_PEG_BOLT_2_4_M = "D47_MDX_PEG_BOLT_2_4_M",
    D47_MDX_PEG_BOLT_3_0_M = "D47_MDX_PEG_BOLT_3_0_M",
    D39_MDX_PEG_BOLT_1_8_M = "D39_MDX_PEG_BOLT_1_8_M",
    D39_MDX_PEG_BOLT_2_1_M = "D39_MDX_PEG_BOLT_2_1_M",
    D39_MDX_PEG_BOLT_2_4_M = "D39_MDX_PEG_BOLT_2_4_M",
    D39_MDX_PEG_BOLT_3_0_M = "D39_MDX_PEG_BOLT_3_0_M",
    D47_MD_PEG_BOLT_1_8_M = "D47_MD_PEG_BOLT_1_8_M",
    D47_MD_PEG_BOLT_2_1_M = "D47_MD_PEG_BOLT_2_1_M",
    D47_MD_PEG_BOLT_2_4_M = "D47_MD_PEG_BOLT_2_4_M",
    D47_MD_PEG_BOLT_3_0_M = "D47_MD_PEG_BOLT_3_0_M",
    FRICTION_BOLT_47_MM = "FRICTION_BOLT_47_MM",
    FRICTION_BOLT_39_MM = "FRICTION_BOLT_39_MM",
    FRICTION_BOLT_33_MM = "FRICTION_BOLT_33_MM",
    SPIRAL_FRICTION_BOLT = "SPIRAL_FRICTION_BOLT",
    KINLOC_BOLT = "KINLOC_BOLT",
    KINLOC_BOLT_INDIE = "KINLOC_BOLT_INDIE"
}

export enum RingPosition {
    RH_BACKS = "RH_BACKS",
    RH_SHOULDER = "RH_SHOULDER",
    RH_WALL_UPPER = "RH_WALL_UPPER",
    RH_WALL_CENTER = "RH_WALL_CENTER",
    RH_WALL_LOWER = "RH_WALL_LOWER",
    RH_FACE_HIGH = "RH_FACE_HIGH",
    RH_FACE_LOW = "RH_FACE_LOW",
    LH_BACKS = "LH_BACKS",
    LH_SHOULDER = "LH_SHOULDER",
    LH_WALL_UPPER = "LH_WALL_UPPER",
    LH_WALL_CENTER = "LH_WALL_CENTER",
    LH_WALL_LOWER = "LH_WALL_LOWER",
    LH_FACE_HIGH = "LH_FACE_HIGH",
    LH_FACE_LOW = "LH_FACE_LOW",
    CENTER_BACKS = "CENTER_BACKS"
}

export enum PullTestAbortReason {
    NOT_TESTED_VOID_CAVITY = "NOT_TESTED_VOID_CAVITY",
    TEST_STOPPED_INSTALL_ANGLE = "TEST_STOPPED_INSTALL_ANGLE",
    PEG_NOT_EXTRUDED = "PEG_NOT_EXTRUDED",
    HIGH_ANGLE_NOT_PERPENDICULAR = "HIGH_ANGLE_NOT_PERPENDICULAR",
    REBAR_EJECTED_STOPPER_CAUGHT = "REBAR_EJECTED_STOPPER_CAUGHT",
    BOLT_END_DAMAGE_RIG_NOT_ENGAGING = "BOLT_END_DAMAGE_RIG_NOT_ENGAGING"
}

export enum Application {
    PULL_TEST = "PULL_TEST",
    PULL_TEST_TECHNICIAN = "PULL_TEST_TECHNICIAN",
    BANSHEE = "BANSHEE"
}

export enum PlanLevel {
    GOLD = "GOLD",
    SILVER = "SILVER",
    BRONZE = "BRONZE",
    INACTIVE = "INACTIVE"
}

export enum ProceqStatus {
    ELASTIC = "ELASTIC",
    LOW_PLASTIC = "LOW_PLASTIC",
    HIGH_PLASTIC = "HIGH_PLASTIC",
    BROKEN = "BROKEN",
    NOT_MEASURABLE = "NOT_MEASURABLE",
    UNMEASURED = "UNMEASURED"
}

export class CreateBansheeRequestInput {
    serialNumber: string;
    name?: Nullable<string>;
    levelId: string;
    driveId: string;
    locationId: string;
    coordinates?: Nullable<JSON>;
    period: number;
    locationDetails?: Nullable<string>;
    boltInstallationDateTime?: Nullable<DateTime>;
    ringPosition: RingPosition;
    comment?: Nullable<string>;
    isBrokenBolt: boolean;
    isNotMeasurable: boolean;
    images?: Nullable<Upload[]>;
    boltType?: Nullable<string>;
    companyId: string;
    siteId: string;
}

export class UpdateBansheeRequestInput {
    serialNumber?: Nullable<string>;
    name?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    coordinates?: Nullable<JSON>;
    period?: Nullable<number>;
    locationDetails?: Nullable<string>;
    boltInstallationDateTime?: Nullable<DateTime>;
    ringPosition?: Nullable<RingPosition>;
    comment?: Nullable<string>;
    isBrokenBolt?: Nullable<boolean>;
    isNotMeasurable?: Nullable<boolean>;
    images?: Nullable<Upload[]>;
    measured?: Nullable<boolean>;
    boltType?: Nullable<string>;
    companyId?: Nullable<string>;
    siteId?: Nullable<string>;
    activateNotifications?: Nullable<boolean>;
}

export class BansheeTemplateInput {
    templateName: string;
    period?: Nullable<number>;
    boltInstallationDateTime?: Nullable<DateTime>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    locationDetails?: Nullable<string>;
    coordinates?: Nullable<JSON>;
    activateNotifications?: Nullable<boolean>;
    comment?: Nullable<string>;
    companyId: string;
    ringPosition?: Nullable<RingPosition>;
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
    image?: Nullable<Upload>;
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
    image?: Nullable<Upload>;
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
    sandvikAdminUserId?: Nullable<string>;
    plans?: Nullable<CreatePlanInput[]>;
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
    sandvikAdminUserId?: Nullable<string>;
    plans?: Nullable<UpdatePlanInput[]>;
}

export class UpdatePlanInput {
    id?: Nullable<string>;
    applicationName: string;
    planLevel?: Nullable<string>;
    expiringDate?: Nullable<DateTime>;
}

export class CreateDriveInput {
    driveName: string;
    levelId: string;
}

export class UpdateDriveInput {
    driveName?: Nullable<string>;
}

export class CreateInvitationInput {
    email: string;
    companyId: string;
    role: string;
    appsAccess: string[];
}

export class CreateGlobalInvitationInput {
    email: string;
    globalRole: string;
    isGlobalVisibility?: Nullable<boolean>;
}

export class CompleteInvitationInput {
    id: string;
    token: string;
    fullName: string;
    password: string;
    workPlace: string;
    phoneNumber?: Nullable<string>;
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

export class RequestPasswordResetInput {
    email: string;
}

export class ValidateResetTokenInput {
    email: string;
    token: string;
}

export class ConfirmPasswordResetInput {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
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

export class UpdatePasswordInput {
    oldPassword?: Nullable<string>;
    newPassword?: Nullable<string>;
    confirmPassword?: Nullable<string>;
}

export class BansheeRequest {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    serialNumber: string;
    name?: Nullable<string>;
    levelId: string;
    driveId: string;
    locationId: string;
    companyId: string;
    coordinates?: Nullable<JSON>;
    period: number;
    locationDetails?: Nullable<string>;
    boltInstallationDateTime?: Nullable<DateTime>;
    ringPosition: string;
    comment?: Nullable<string>;
    isBrokenBolt: boolean;
    isNotMeasurable: boolean;
    images?: Nullable<string[]>;
    proceqData?: Nullable<ProceqData[]>;
    eventLogs?: Nullable<BansheeEventLog[]>;
    measured: boolean;
    createdBy: string;
    updatedBy?: Nullable<string>;
    createdByUser?: Nullable<User>;
    level?: Nullable<Level>;
    drive?: Nullable<Drive>;
    location?: Nullable<Location>;
    company?: Nullable<Company>;
    site?: Nullable<Site>;
    siteId: string;
    boltType?: Nullable<string>;
    activateNotifications?: Nullable<boolean>;
    boltTypeConstant?: Nullable<BansheeBoltTypeConstant>;
}

export class BansheeRequestResponse {
    totalRecords: number;
    results: BansheeRequest[];
}

export class LocationDistribution {
    locationId: string;
    locationName: string;
    total: number;
    statusCounts: StatusCount[];
    results: BansheeRequest[];
}

export class BansheeStatusDistribution {
    total: number;
    statusCounts: StatusCount[];
    byLocation?: Nullable<LocationDistribution[]>;
}

export abstract class IQuery {
    bansheeRequests?: BansheeRequestResponse;
    bansheeRequest?: BansheeRequest;
    bansheeStatusDistribution?: BansheeStatusDistribution;
    bansheeEventLogs?: BansheeEventLogResponse;
    bansheeSessionStats?: BansheeSessionStats[];
    getBansheeTemplates?: BansheeTemplate[];
    getBansheeTemplateById?: Nullable<BansheeTemplate>;
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
    getProceqStatus?: Nullable<ProceqStatus[]>;
    hazards?: Nullable<BoltResult[]>;
    validateInvitation?: InvitationValidation;
    pendingInvitations?: Invitation[];
    pendingGlobalInvitations: Invitation[];
    levels: Level[];
    level?: Level;
    locations: Location[];
    location?: Location;
    proceqLoginUrl?: ProceqLoginUrlResponse;
    sites: Site[];
    site?: Site;
    userPermissions: UserPermission[];
    userPermission?: UserPermission;
    users?: User[];
    user?: User;
}

export class StatusCount {
    status: string;
    count: number;
}

export abstract class IMutation {
    createBansheeRequest?: BansheeRequest;
    updateBansheeRequest?: BansheeRequest;
    deleteBansheeRequest?: BansheeRequest;
    createBansheeTemplate?: BansheeTemplate;
    updateBansheeTemplate?: BansheeTemplate;
    deleteBansheeTemplate?: BansheeTemplate;
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
    createInvitation?: InvitationResponse;
    createGlobalInvitation?: InvitationResponse;
    completeInvitation?: User;
    resendInvitation?: Invitation;
    removeInvitation?: Invitation;
    createLevel?: Level;
    updateLevel?: Level;
    removeLevel?: Level;
    createLocation?: Location;
    updateLocation?: Location;
    removeLocation?: Location;
    requestPasswordReset?: boolean;
    validateResetToken?: boolean;
    confirmPasswordReset?: boolean;
    createSite?: Site;
    updateSite?: Site;
    removeSite?: Site;
    createUserPermission?: UserPermission;
    updateUserPermission?: UserPermission;
    removeUserPermission?: UserPermission;
    updateUser?: User;
    removeUser?: User;
}

export class BansheeEventLog {
    id: string;
    createdAt: DateTime;
    eventType: string;
    previousStatus: string;
    newStatus: string;
    source?: Nullable<string>;
    measurementId?: Nullable<string>;
    bansheeRequestId: string;
    bansheeRequest?: Nullable<BansheeRequest>;
}

export class BansheeEventLogResponse {
    totalRecords: number;
    results: BansheeEventLog[];
}

export class BansheeBoltTypeConstant {
    id: string;
    boltType: string;
    velocity: number;
    tempCorrectionFactor: number;
    tempCoeff: number;
    quadCoeff1: number;
    linCoeff1: number;
    quadCoeff2: number;
    linCoeff2: number;
    constTerm: number;
    nominalLength: number;
    linearLimit: number;
    elasticLimit: number;
    lowPlasticLimit: number;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class BansheeSessionStats {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    sessionDate: DateTime;
    totalMeasured: number;
    notMeasurable: number;
    broken: number;
    site: Site;
    company?: Nullable<Company>;
}

export class BansheeTemplate {
    id: string;
    templateName: string;
    period?: Nullable<number>;
    boltInstallationDateTime?: Nullable<DateTime>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    locationDetails?: Nullable<string>;
    coordinates?: Nullable<JSON>;
    comment?: Nullable<string>;
    companyId: string;
    activateNotifications?: Nullable<boolean>;
    ringPosition?: Nullable<RingPosition>;
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
    failedCount: number;
    hazardCount: number;
    passedCount: number;
    totalRecords: number;
    averageTons?: Nullable<number>;
    results: BoltResult[];
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
    pendingInvitations?: Nullable<Invitation[]>;
    sandvikAdminUserId?: Nullable<string>;
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

export class Invitation {
    id: string;
    email: string;
    expiresAt: DateTime;
    createdAt: DateTime;
    used: boolean;
    companyId?: Nullable<string>;
    companyName?: Nullable<string>;
    globalRole?: Nullable<string>;
    role?: Nullable<string>;
    isGlobalVisibility?: Nullable<boolean>;
}

export class InvitationResponse {
    invitationId?: Nullable<string>;
    userId?: Nullable<string>;
    isNewUser: boolean;
    message?: Nullable<string>;
}

export class InvitationValidation {
    valid: boolean;
    reason?: Nullable<string>;
    invitation?: Nullable<Invitation>;
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

export class ProceqReading {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    readingIndex: number;
    indicationSetupFileName?: Nullable<string>;
    measuringMode?: Nullable<string>;
    frequency?: Nullable<number>;
    gain?: Nullable<number>;
    voltage?: Nullable<number>;
    sampleAveraging?: Nullable<number>;
    damping?: Nullable<number>;
    analogueFilter?: Nullable<number>;
    zeroOffset?: Nullable<number>;
    level?: Nullable<number>;
    measurementLevel?: Nullable<number>;
    referenceSamplingRate?: Nullable<number>;
    start?: Nullable<number>;
    width?: Nullable<number>;
    gate1MaximumAmplitude?: Nullable<number>;
    gate1SoundPathDistance?: Nullable<number>;
    gate1SoundPathDistanceInTimeUnit?: Nullable<number>;
    status?: Nullable<string>;
    elongation?: Nullable<number>;
}

export class ProceqData {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    measurementId: string;
    fileName: string;
    operator?: Nullable<string>;
    email?: Nullable<string>;
    dueDate: DateTime;
    comments: string;
    temperature?: Nullable<number>;
    rawDataZipId?: Nullable<string>;
    rawDataZipPath?: Nullable<string>;
    status?: Nullable<string>;
    attachmentIds?: Nullable<Nullable<string>[]>;
    createdTimestamp?: Nullable<DateTime>;
    updatedTimestamp?: Nullable<DateTime>;
    bansheeRequest?: Nullable<BansheeRequest>;
    proceqAttachments?: Nullable<ProceqAttachment[]>;
    readings?: Nullable<ProceqReading[]>;
}

export class ProceqAttachment {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    attachmentId: string;
    measurementId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize?: Nullable<number>;
    attachmentType: string;
    description?: Nullable<string>;
}

export class ProceqLoginUrlResponse {
    url: string;
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
export type Upload = any;
export type JSON = any;
type Nullable<T> = T | null;
