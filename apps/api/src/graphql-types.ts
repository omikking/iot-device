
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum BansheeCartItemType {
    NEW_BANSHEE = "NEW_BANSHEE",
    SERVICE_EXISTING = "SERVICE_EXISTING"
}

export enum BansheeEmailStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED"
}

export enum BansheeOrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum BansheeOrderItemStatus {
    PENDING = "PENDING",
    FULFILLED = "FULFILLED",
    CANCELLED = "CANCELLED"
}

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
    FRICTION_BOLT_47_MM_1_8_M = "FRICTION_BOLT_47_MM_1_8_M",
    FRICTION_BOLT_47_MM_2_1_M = "FRICTION_BOLT_47_MM_2_1_M",
    FRICTION_BOLT_47_MM_2_4_M = "FRICTION_BOLT_47_MM_2_4_M",
    FRICTION_BOLT_47_MM_3_0_M = "FRICTION_BOLT_47_MM_3_0_M",
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
    BOLT_END_DAMAGE_RIG_NOT_ENGAGING = "BOLT_END_DAMAGE_RIG_NOT_ENGAGING",
    PULL_TEST_COLLAR_INSTALLED_BACKWARDS = "PULL_TEST_COLLAR_INSTALLED_BACKWARDS",
    BROKEN_BOLT_NUT = "BROKEN_BOLT_NUT"
}

export enum Application {
    PULL_TEST = "PULL_TEST",
    PULL_TEST_TECHNICIAN = "PULL_TEST_TECHNICIAN",
    BANSHEE = "BANSHEE",
    HYDRA = "HYDRA"
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

export class AddCartItemInput {
    itemType: BansheeCartItemType;
    bansheeRequestId?: Nullable<string>;
    name?: Nullable<string>;
    quantity?: Nullable<number>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    period?: Nullable<number>;
    companyId: string;
}

export class UpdateNewBansheeCartItemInput {
    quantity?: Nullable<number>;
    name?: Nullable<string>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    period?: Nullable<number>;
}

export class BansheeSharePlotListInput {
    companyId: string;
    recipientEmail: string;
}

export class BansheeContactUsInput {
    companyId: string;
    message: string;
}

export class BansheeContactUsInboxFilter {
    status?: Nullable<BansheeEmailStatus>;
    companyId?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
}

export class SubmitOrderInput {
    companyId: string;
    attachmentsName?: Nullable<string[]>;
    comment: string;
}

export class OrderFilterInput {
    status?: Nullable<BansheeOrderStatus>;
    companyId?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
}

export class CreateBansheeRequestInput {
    bansheeOrderItemId?: Nullable<string>;
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
    measured?: Nullable<boolean>;
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
    measuredAt: DateTime;
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
    measuredAt?: Nullable<DateTime>;
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

export class CreateHydraboltInput {
    partNumber: string;
    drawingNumber?: Nullable<string>;
    boltLength: number;
    description?: Nullable<string>;
    numberOfFBG: number;
    positionOfFBGs: number[];
    initialWavelength: number[];
    elasticLimit: number;
    lowPlasticLimit: number;
    highPlasticLimit: number;
    maxCalibrationFactor: number;
    minCalibrationFactor: number;
}

export class UpdateHydraboltInput {
    partNumber?: Nullable<string>;
    drawingNumber?: Nullable<string>;
    boltLength?: Nullable<number>;
    description?: Nullable<string>;
    numberOfFBG?: Nullable<number>;
    positionOfFBGs?: Nullable<number[]>;
    initialWavelength?: Nullable<number[]>;
    elasticLimit?: Nullable<number>;
    lowPlasticLimit?: Nullable<number>;
    highPlasticLimit?: Nullable<number>;
    maxCalibrationFactor?: Nullable<number>;
    minCalibrationFactor?: Nullable<number>;
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

export class CreateOpticboltSpectrumInput {
    fbgIndex: number;
    amplitude20?: Nullable<number>;
    wavelength20?: Nullable<number>;
    amplitude100?: Nullable<number>;
    wavelength100?: Nullable<number>;
    peakInitialNm?: Nullable<number>;
    peak20Nm?: Nullable<number>;
    peak100Nm?: Nullable<number>;
    strain20?: Nullable<number>;
    strain100?: Nullable<number>;
    load20?: Nullable<number>;
    load100?: Nullable<number>;
    time20Ms?: Nullable<number>;
    time100Ms?: Nullable<number>;
    calibrationFactor?: Nullable<number>;
}

export class CreateOpticboltTestResultWithSpectrumsInput {
    serialNumber: string;
    drawingNumber?: Nullable<string>;
    boltType?: Nullable<string>;
    description?: Nullable<string>;
    testedAt: DateTime;
    testedBy: string;
    result: string;
    fibreCheck1?: Nullable<boolean>;
    fibreCheck2?: Nullable<boolean>;
    fibreCheck3?: Nullable<boolean>;
    psi20?: Nullable<number>;
    psi100?: Nullable<number>;
    spectrums: CreateOpticboltSpectrumInput[];
}

export class UpdateOpticboltSpectrumInput {
    fbgIndex: number;
    amplitude20?: Nullable<number>;
    wavelength20?: Nullable<number>;
    amplitude100?: Nullable<number>;
    wavelength100?: Nullable<number>;
    peakInitialNm?: Nullable<number>;
    peak20Nm?: Nullable<number>;
    peak100Nm?: Nullable<number>;
    strain20?: Nullable<number>;
    strain100?: Nullable<number>;
    load20?: Nullable<number>;
    load100?: Nullable<number>;
    time20Ms?: Nullable<number>;
    time100Ms?: Nullable<number>;
    calibrationFactor?: Nullable<number>;
}

export class UpdateOpticboltTestResultInput {
    serialNumber?: Nullable<string>;
    drawingNumber?: Nullable<string>;
    boltType?: Nullable<string>;
    description?: Nullable<string>;
    testedAt?: Nullable<DateTime>;
    testedBy?: Nullable<string>;
    result?: Nullable<string>;
    fibreCheck1?: Nullable<boolean>;
    fibreCheck2?: Nullable<boolean>;
    fibreCheck3?: Nullable<boolean>;
    psi20?: Nullable<number>;
    psi100?: Nullable<number>;
    spectrums?: Nullable<UpdateOpticboltSpectrumInput[]>;
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

export class BansheeCartItem {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    itemType: BansheeCartItemType;
    bansheeRequestId?: Nullable<string>;
    bansheeRequest?: Nullable<BansheeRequest>;
    name?: Nullable<string>;
    quantity: number;
    period?: Nullable<number>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    site?: Nullable<Site>;
    level?: Nullable<Level>;
    drive?: Nullable<Drive>;
    location?: Nullable<Location>;
    companyId: string;
    company?: Nullable<Company>;
}

export class BansheeCartItemStats {
    newBanshee: number;
    serviceExisting: number;
    total: number;
}

export class SkippedBansheeRequest {
    bansheeRequestId: string;
    serialNumber?: Nullable<string>;
    reason: string;
}

export class AddCartItemsResult {
    added: BansheeCartItem[];
    skipped: SkippedBansheeRequest[];
}

export abstract class IQuery {
    cartItems?: BansheeCartItem[];
    cartItemsStats?: BansheeCartItemStats;
    bansheeContactUsInbox?: BansheeContactUsInboxResponse;
    bansheeContactById?: Nullable<BansheeEmail>;
    orders?: OrdersResponse;
    order?: BansheeOrder;
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
    getBoltTypesOptions: EnumOption[];
    getRingPosition?: Nullable<RingPosition[]>;
    getRingPositionOptions: EnumOption[];
    getPullTestAbortReason?: Nullable<PullTestAbortReason[]>;
    getPullTestAbortReasonOptions: EnumOption[];
    getApplication?: Nullable<Application[]>;
    getPlanLevel?: Nullable<PlanLevel[]>;
    getProceqStatus?: Nullable<ProceqStatus[]>;
    hazards?: Nullable<BoltResult[]>;
    hydrabolts?: Hydrabolt[];
    hydraboltByPartNumber?: Nullable<Hydrabolt>;
    validateInvitation?: InvitationValidation;
    pendingInvitations?: Invitation[];
    pendingGlobalInvitations: Invitation[];
    levels: Level[];
    level?: Level;
    locations: Location[];
    location?: Location;
    opticboltTestResults?: OpticboltTestResult[];
    opticboltSpectrumsBySerialNumber?: OpticboltSpectrum[];
    proceqLoginUrl?: ProceqLoginUrlResponse;
    getProceqTokenStatus: GetProceqTokenStatusResponse;
    sites: Site[];
    site?: Site;
    userPermissions: UserPermission[];
    userPermission?: UserPermission;
    users?: User[];
    user?: User;
}

export abstract class IMutation {
    addCartItems?: AddCartItemsResult;
    updateNewBansheeCartItem?: BansheeCartItem;
    deleteCartItem?: BansheeCartItem;
    clearCart?: boolean;
    bansheeSharePlotList?: BansheeSharePlotListResponse;
    bansheeContactUs?: BansheeContactUsResponse;
    submitOrder?: BansheeOrder;
    cancelOrder?: BansheeOrder;
    completeOrder?: BansheeOrder;
    fulfillOrderItem?: BansheeOrderItem;
    cancelOrderItem?: BansheeOrderItem;
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
    createHydrabolt?: Hydrabolt;
    updateHydrabolt?: Hydrabolt;
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
    createOpticboltTestResultWithSpectrums?: OpticboltTestResult;
    updateOpticboltTestResult?: OpticboltTestResult;
    updateOpticboltSpectrum?: OpticboltSpectrum;
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

export class BansheeEmailAttachment {
    id: string;
    originalFileName: string;
    storedFileName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    createdAt: DateTime;
}

export class BansheeEmail {
    id: string;
    status: BansheeEmailStatus;
    message: string;
    userId: string;
    companyId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    attachments?: Nullable<BansheeEmailAttachment[]>;
}

export class BansheeSharePlotListResponse {
    success: boolean;
    sentTo?: Nullable<string>;
    message?: Nullable<string>;
}

export class BansheeContactUsResponse {
    success: boolean;
    message?: Nullable<string>;
    email?: Nullable<BansheeEmail>;
}

export class BansheeContactUsInboxResponse {
    items: BansheeEmail[];
    total: number;
}

export class BansheeOrder {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    status: BansheeOrderStatus;
    attachments: string[];
    comment: string;
    companyId: string;
    company?: Nullable<Company>;
    orderItems: BansheeOrderItem[];
}

export class BansheeOrderItem {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    itemType: BansheeCartItemType;
    status: BansheeOrderItemStatus;
    bansheeRequestId?: Nullable<string>;
    bansheeRequest?: Nullable<BansheeRequest>;
    name?: Nullable<string>;
    period?: Nullable<number>;
    siteId?: Nullable<string>;
    levelId?: Nullable<string>;
    driveId?: Nullable<string>;
    locationId?: Nullable<string>;
    site?: Nullable<Site>;
    level?: Nullable<Level>;
    drive?: Nullable<Drive>;
    location?: Nullable<Location>;
    orderId: string;
    order?: Nullable<BansheeOrder>;
}

export class OrdersResponse {
    totalRecords: number;
    results: BansheeOrder[];
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
    siteName: string;
    levelName: string;
    driveName: string;
    total: number;
    statusCounts: StatusCount[];
    results: BansheeRequest[];
}

export class BansheeStatusDistribution {
    total: number;
    statusCounts: StatusCount[];
    byLocation?: Nullable<LocationDistribution[]>;
}

export class StatusCount {
    status: string;
    count: number;
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
    measuredAt: DateTime;
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

export class EnumOption {
    value: string;
    label: string;
}

export class Hydrabolt {
    id: string;
    partNumber: string;
    drawingNumber?: Nullable<string>;
    boltLength: number;
    description?: Nullable<string>;
    numberOfFBG: number;
    positionOfFBGs: number[];
    initialWavelength: number[];
    elasticLimit: number;
    lowPlasticLimit: number;
    highPlasticLimit: number;
    maxCalibrationFactor: number;
    minCalibrationFactor: number;
    createdAt: DateTime;
    updatedAt: DateTime;
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

export class OpticboltSpectrum {
    id: string;
    testResultId: string;
    fbgIndex: number;
    amplitude20?: Nullable<number>;
    wavelength20?: Nullable<number>;
    amplitude100?: Nullable<number>;
    wavelength100?: Nullable<number>;
    peakInitialNm?: Nullable<number>;
    peak20Nm?: Nullable<number>;
    peak100Nm?: Nullable<number>;
    strain20?: Nullable<number>;
    strain100?: Nullable<number>;
    load20?: Nullable<number>;
    load100?: Nullable<number>;
    time20Ms?: Nullable<number>;
    time100Ms?: Nullable<number>;
    calibrationFactor?: Nullable<number>;
    createdAt: DateTime;
}

export class OpticboltTestResult {
    id: string;
    serialNumber: string;
    drawingNumber?: Nullable<string>;
    boltType?: Nullable<string>;
    description?: Nullable<string>;
    testedAt: DateTime;
    testedBy: string;
    result: string;
    fibreCheck1: boolean;
    fibreCheck2: boolean;
    fibreCheck3: boolean;
    psi20?: Nullable<number>;
    psi100?: Nullable<number>;
    createdAt: DateTime;
    updatedAt: DateTime;
    spectrums: OpticboltSpectrum[];
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
    dueDate?: Nullable<DateTime>;
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

export class GetProceqTokenStatusResponse {
    valid: boolean;
    canRefresh: boolean;
    expiresAt?: Nullable<string>;
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

export type Upload = any;
export type DateTime = any;
export type JSON = any;
type Nullable<T> = T | null;
