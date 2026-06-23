/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AddCartItemInput = {
  bansheeRequestId?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  driveId?: InputMaybe<Scalars['String']['input']>;
  itemType: BansheeCartItemType;
  levelId?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
};

export type AddCartItemsResult = {
  __typename?: 'AddCartItemsResult';
  added: Array<BansheeCartItem>;
  skipped: Array<SkippedBansheeRequest>;
};

export enum Application {
  Banshee = 'BANSHEE',
  PullTest = 'PULL_TEST',
  PullTestTechnician = 'PULL_TEST_TECHNICIAN'
}

export type BansheeBoltTypeConstant = {
  __typename?: 'BansheeBoltTypeConstant';
  boltType: Scalars['String']['output'];
  constTerm: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  elasticLimit: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  linCoeff1: Scalars['Float']['output'];
  linCoeff2: Scalars['Float']['output'];
  linearLimit: Scalars['Float']['output'];
  lowPlasticLimit: Scalars['Float']['output'];
  nominalLength: Scalars['Float']['output'];
  quadCoeff1: Scalars['Float']['output'];
  quadCoeff2: Scalars['Float']['output'];
  tempCoeff: Scalars['Float']['output'];
  tempCorrectionFactor: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  velocity: Scalars['Float']['output'];
};

export type BansheeCartItem = {
  __typename?: 'BansheeCartItem';
  bansheeRequest?: Maybe<BansheeRequest>;
  bansheeRequestId?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Company>;
  companyId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  drive?: Maybe<Drive>;
  driveId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  itemType: BansheeCartItemType;
  level?: Maybe<Level>;
  levelId?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Location>;
  locationId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  period?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Int']['output'];
  site?: Maybe<Site>;
  siteId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BansheeCartItemStats = {
  __typename?: 'BansheeCartItemStats';
  newBanshee: Scalars['Int']['output'];
  serviceExisting: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum BansheeCartItemType {
  NewBanshee = 'NEW_BANSHEE',
  ServiceExisting = 'SERVICE_EXISTING'
}

export type BansheeContactUsInboxFilter = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<BansheeEmailStatus>;
};

export type BansheeContactUsInboxResponse = {
  __typename?: 'BansheeContactUsInboxResponse';
  items: Array<BansheeEmail>;
  total: Scalars['Int']['output'];
};

export type BansheeContactUsInput = {
  companyId: Scalars['String']['input'];
  message: Scalars['String']['input'];
};

export type BansheeContactUsResponse = {
  __typename?: 'BansheeContactUsResponse';
  email?: Maybe<BansheeEmail>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type BansheeEmail = {
  __typename?: 'BansheeEmail';
  attachments?: Maybe<Array<BansheeEmailAttachment>>;
  companyId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: BansheeEmailStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type BansheeEmailAttachment = {
  __typename?: 'BansheeEmailAttachment';
  createdAt: Scalars['DateTime']['output'];
  filePath: Scalars['String']['output'];
  fileSize: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  originalFileName: Scalars['String']['output'];
  storedFileName: Scalars['String']['output'];
};

export enum BansheeEmailStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Sent = 'SENT'
}

export type BansheeEventLog = {
  __typename?: 'BansheeEventLog';
  bansheeRequest?: Maybe<BansheeRequest>;
  bansheeRequestId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  eventType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  measurementId?: Maybe<Scalars['String']['output']>;
  newStatus: Scalars['String']['output'];
  previousStatus: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
};

export type BansheeEventLogResponse = {
  __typename?: 'BansheeEventLogResponse';
  results: Array<BansheeEventLog>;
  totalRecords: Scalars['Int']['output'];
};

export type BansheeOrder = {
  __typename?: 'BansheeOrder';
  attachments: Array<Scalars['String']['output']>;
  comment: Scalars['String']['output'];
  company?: Maybe<Company>;
  companyId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  orderItems: Array<BansheeOrderItem>;
  status: BansheeOrderStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type BansheeOrderItem = {
  __typename?: 'BansheeOrderItem';
  bansheeRequest?: Maybe<BansheeRequest>;
  bansheeRequestId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  drive?: Maybe<Drive>;
  driveId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  itemType: BansheeCartItemType;
  level?: Maybe<Level>;
  levelId?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Location>;
  locationId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<BansheeOrder>;
  orderId: Scalars['String']['output'];
  period?: Maybe<Scalars['Int']['output']>;
  site?: Maybe<Site>;
  siteId?: Maybe<Scalars['String']['output']>;
  status: BansheeOrderItemStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum BansheeOrderItemStatus {
  Cancelled = 'CANCELLED',
  Fulfilled = 'FULFILLED',
  Pending = 'PENDING'
}

export enum BansheeOrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  PartiallyCompleted = 'PARTIALLY_COMPLETED',
  Pending = 'PENDING'
}

/**
 * BansheeRequest model
 * Define the BansheeRequest model and its fields
 */
export type BansheeRequest = {
  __typename?: 'BansheeRequest';
  activateNotifications?: Maybe<Scalars['Boolean']['output']>;
  boltInstallationDateTime?: Maybe<Scalars['DateTime']['output']>;
  boltType?: Maybe<Scalars['String']['output']>;
  boltTypeConstant?: Maybe<BansheeBoltTypeConstant>;
  comment?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Company>;
  companyId: Scalars['String']['output'];
  coordinates?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  createdByUser?: Maybe<User>;
  drive?: Maybe<Drive>;
  driveId: Scalars['String']['output'];
  eventLogs?: Maybe<Array<BansheeEventLog>>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  isBrokenBolt: Scalars['Boolean']['output'];
  isNotMeasurable: Scalars['Boolean']['output'];
  level?: Maybe<Level>;
  levelId: Scalars['String']['output'];
  location?: Maybe<Location>;
  locationDetails?: Maybe<Scalars['String']['output']>;
  locationId: Scalars['String']['output'];
  measured: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  period: Scalars['Int']['output'];
  proceqData?: Maybe<Array<ProceqData>>;
  ringPosition: Scalars['String']['output'];
  serialNumber: Scalars['String']['output'];
  site?: Maybe<Site>;
  siteId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

/**
 * BansheeRequestResponse
 * Response structure for paginated list of banshee requests
 */
export type BansheeRequestResponse = {
  __typename?: 'BansheeRequestResponse';
  results: Array<BansheeRequest>;
  totalRecords: Scalars['Int']['output'];
};

export type BansheeSessionStats = {
  __typename?: 'BansheeSessionStats';
  broken: Scalars['Int']['output'];
  company?: Maybe<Company>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  notMeasurable: Scalars['Int']['output'];
  sessionDate: Scalars['DateTime']['output'];
  site: Site;
  totalMeasured: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BansheeSharePlotListInput = {
  companyId: Scalars['String']['input'];
  recipientEmail: Scalars['String']['input'];
};

export type BansheeSharePlotListResponse = {
  __typename?: 'BansheeSharePlotListResponse';
  message?: Maybe<Scalars['String']['output']>;
  sentTo?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type BansheeStatusDistribution = {
  __typename?: 'BansheeStatusDistribution';
  byLocation?: Maybe<Array<LocationDistribution>>;
  statusCounts: Array<StatusCount>;
  total: Scalars['Int']['output'];
};

/**
 * BansheeTemplate model
 * Define the BansheeTemplate model and its fields
 */
export type BansheeTemplate = {
  __typename?: 'BansheeTemplate';
  activateNotifications?: Maybe<Scalars['Boolean']['output']>;
  boltInstallationDateTime?: Maybe<Scalars['DateTime']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  companyId: Scalars['String']['output'];
  coordinates?: Maybe<Scalars['JSON']['output']>;
  driveId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  levelId?: Maybe<Scalars['String']['output']>;
  locationDetails?: Maybe<Scalars['String']['output']>;
  locationId?: Maybe<Scalars['String']['output']>;
  period?: Maybe<Scalars['Int']['output']>;
  ringPosition?: Maybe<RingPosition>;
  siteId?: Maybe<Scalars['String']['output']>;
  templateName: Scalars['String']['output'];
};

/**
 * BansheeTemplateInput
 * Define the input fields to create a new BansheeTemplate or update an existing BansheeTemplate
 */
export type BansheeTemplateInput = {
  activateNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  boltInstallationDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  driveId?: InputMaybe<Scalars['String']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  locationDetails?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  ringPosition?: InputMaybe<RingPosition>;
  siteId?: InputMaybe<Scalars['String']['input']>;
  templateName: Scalars['String']['input'];
};

/**
 * BoltResult model
 * Define the BoltResult model and its fields
 */
export type BoltResult = {
  __typename?: 'BoltResult';
  abortReason?: Maybe<Scalars['String']['output']>;
  boltNumber: Scalars['Int']['output'];
  boltType: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  drive?: Maybe<Drive>;
  driveId: Scalars['String']['output'];
  hazardCompletedDate?: Maybe<Array<Scalars['DateTime']['output']>>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isHazard: Scalars['Boolean']['output'];
  level?: Maybe<Level>;
  levelId: Scalars['String']['output'];
  location?: Maybe<Location>;
  locationId: Scalars['String']['output'];
  measuredAt: Scalars['DateTime']['output'];
  peakDisplacement: Array<Scalars['Int']['output']>;
  peakLoad: Array<Scalars['Int']['output']>;
  positionInRing: Scalars['String']['output'];
  result: Scalars['String']['output'];
  site?: Maybe<Site>;
  siteId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

/**
 * BoltResultResponse
 * Response structure for paginated list of bolt results
 */
export type BoltResultResponse = {
  __typename?: 'BoltResultResponse';
  averageTons?: Maybe<Scalars['Float']['output']>;
  failedCount: Scalars['Int']['output'];
  hazardCount: Scalars['Int']['output'];
  passedCount: Scalars['Int']['output'];
  results: Array<BoltResult>;
  totalRecords: Scalars['Int']['output'];
};

export enum BoltType {
  D39Mdx_1_8M = 'D39_MDX_1_8_M',
  D39Mdx_2_1M = 'D39_MDX_2_1_M',
  D39Mdx_2_4M = 'D39_MDX_2_4_M',
  D39Mdx_3_0M = 'D39_MDX_3_0_M',
  D39MdxPegBolt_1_8M = 'D39_MDX_PEG_BOLT_1_8_M',
  D39MdxPegBolt_2_1M = 'D39_MDX_PEG_BOLT_2_1_M',
  D39MdxPegBolt_2_4M = 'D39_MDX_PEG_BOLT_2_4_M',
  D39MdxPegBolt_3_0M = 'D39_MDX_PEG_BOLT_3_0_M',
  D47Mdx_1_8M = 'D47_MDX_1_8_M',
  D47Mdx_2_1M = 'D47_MDX_2_1_M',
  D47Mdx_2_4M = 'D47_MDX_2_4_M',
  D47Mdx_3_0M = 'D47_MDX_3_0_M',
  D47Mdx_3_8M = 'D47_MDX_3_8_M',
  D47Mdx_4_0M = 'D47_MDX_4_0_M',
  D47MdxPegBolt_1_8M = 'D47_MDX_PEG_BOLT_1_8_M',
  D47MdxPegBolt_2_1M = 'D47_MDX_PEG_BOLT_2_1_M',
  D47MdxPegBolt_2_4M = 'D47_MDX_PEG_BOLT_2_4_M',
  D47MdxPegBolt_3_0M = 'D47_MDX_PEG_BOLT_3_0_M',
  D47Md_1_8M = 'D47_MD_1_8_M',
  D47Md_2_1M = 'D47_MD_2_1_M',
  D47Md_2_4M = 'D47_MD_2_4_M',
  D47Md_3_0M = 'D47_MD_3_0_M',
  D47Md_3_8M = 'D47_MD_3_8_M',
  D47MdPegBolt_1_8M = 'D47_MD_PEG_BOLT_1_8_M',
  D47MdPegBolt_2_1M = 'D47_MD_PEG_BOLT_2_1_M',
  D47MdPegBolt_2_4M = 'D47_MD_PEG_BOLT_2_4_M',
  D47MdPegBolt_3_0M = 'D47_MD_PEG_BOLT_3_0_M',
  FrictionBolt_33Mm = 'FRICTION_BOLT_33_MM',
  FrictionBolt_39Mm = 'FRICTION_BOLT_39_MM',
  FrictionBolt_47Mm = 'FRICTION_BOLT_47_MM',
  FrictionBolt_47Mm_1_8M = 'FRICTION_BOLT_47_MM_1_8_M',
  FrictionBolt_47Mm_2_1M = 'FRICTION_BOLT_47_MM_2_1_M',
  FrictionBolt_47Mm_2_4M = 'FRICTION_BOLT_47_MM_2_4_M',
  FrictionBolt_47Mm_3_0M = 'FRICTION_BOLT_47_MM_3_0_M',
  KinlocBolt = 'KINLOC_BOLT',
  KinlocBoltIndie = 'KINLOC_BOLT_INDIE',
  SpiralFrictionBolt = 'SPIRAL_FRICTION_BOLT'
}

/**
 * Coffee model
 * Define the Coffee model and its fields
 */
export type Coffee = {
  __typename?: 'Coffee';
  brand: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  flavors?: Maybe<Array<Flavor>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/**
 * Company model
 * Define the Company model and its fields
 */
export type Company = {
  __typename?: 'Company';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  companyContactEmail: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  orgNumber: Scalars['String']['output'];
  pendingInvitations?: Maybe<Array<Invitation>>;
  plans?: Maybe<Array<Plan>>;
  postalCode: Scalars['String']['output'];
  sandvikAdminUserId?: Maybe<Scalars['String']['output']>;
  sites?: Maybe<Array<Site>>;
  updatedAt: Scalars['DateTime']['output'];
  users?: Maybe<Array<User>>;
};

/**
 * CompanyListResponse
 * Response structure for paginated list of companies
 */
export type CompanyListResponse = {
  __typename?: 'CompanyListResponse';
  results: Array<Company>;
  totalRecords: Scalars['Int']['output'];
};

export type CompleteInvitationInput = {
  fullName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
  workPlace: Scalars['String']['input'];
};

export type ConfirmPasswordResetInput = {
  confirmPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

/**
 * CreateBansheeRequestInput
 * Define the input fields to create a new banshee request
 */
export type CreateBansheeRequestInput = {
  bansheeOrderItemId?: InputMaybe<Scalars['String']['input']>;
  boltInstallationDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  boltType?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  driveId: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['Upload']['input']>>;
  isBrokenBolt: Scalars['Boolean']['input'];
  isNotMeasurable: Scalars['Boolean']['input'];
  levelId: Scalars['String']['input'];
  locationDetails?: InputMaybe<Scalars['String']['input']>;
  locationId: Scalars['String']['input'];
  measured?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  period: Scalars['Int']['input'];
  ringPosition: RingPosition;
  serialNumber: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
};

/**
 * CreateBoltResultInput
 * Define the input fields to create a new boltResult
 */
export type CreateBoltResultInput = {
  abortReason?: InputMaybe<Scalars['String']['input']>;
  boltNumber: Scalars['Int']['input'];
  boltType: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  driveId: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  isHazard: Scalars['Boolean']['input'];
  levelId: Scalars['String']['input'];
  locationId: Scalars['String']['input'];
  measuredAt: Scalars['DateTime']['input'];
  peakDisplacement: Array<Scalars['Int']['input']>;
  peakLoad: Array<Scalars['Int']['input']>;
  positionInRing: Scalars['String']['input'];
  result: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

/**
 * CreateCoffeeInput
 * Define the input fields to create a new coffee
 */
export type CreateCoffeeInput = {
  brand: Scalars['String']['input'];
  flavors: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/**
 * CreateCompanyInput
 * Define the input fields to create a new company
 */
export type CreateCompanyInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyContactEmail: Scalars['String']['input'];
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  orgNumber: Scalars['String']['input'];
  plans?: InputMaybe<Array<CreatePlanInput>>;
  postalCode: Scalars['String']['input'];
  sandvikAdminUserId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * CreateDriveInput
 * Define the input fields to create a new drive
 */
export type CreateDriveInput = {
  driveName: Scalars['String']['input'];
  levelId: Scalars['String']['input'];
};

export type CreateGlobalInvitationInput = {
  email: Scalars['String']['input'];
  globalRole: Scalars['String']['input'];
  isGlobalVisibility?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateInvitationInput = {
  appsAccess: Array<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

/**
 * CreateLevelInput
 * Define the input fields to create a new level
 */
export type CreateLevelInput = {
  levelName: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
};

/**
 * CreateLocationInput
 * Define the input fields to create a new location
 */
export type CreateLocationInput = {
  driveId: Scalars['String']['input'];
  locationName: Scalars['String']['input'];
};

/**
 * CreatePlanInput
 * Define the input fields to create a new plan
 */
export type CreatePlanInput = {
  applicationName: Scalars['String']['input'];
  expiringDate?: InputMaybe<Scalars['DateTime']['input']>;
  planLevel: Scalars['String']['input'];
};

/**
 * CreateSiteInput
 * Define the input fields to create a new site
 */
export type CreateSiteInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  siteName: Scalars['String']['input'];
};

/**
 * CreateUserPermissionInput
 * Define the input fields to create a new userPermission
 */
export type CreateUserPermissionInput = {
  appsAccess: Array<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  role: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};

/**
 * Drive model
 * Define the Drive model and its fields
 */
export type Drive = {
  __typename?: 'Drive';
  boltResults?: Maybe<Array<BoltResult>>;
  createdAt: Scalars['DateTime']['output'];
  driveName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  levelId: Scalars['String']['output'];
  locations?: Maybe<Array<Location>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EnumOption = {
  __typename?: 'EnumOption';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Flavor = {
  __typename?: 'Flavor';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Invitation = {
  __typename?: 'Invitation';
  companyId?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  globalRole?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isGlobalVisibility?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  used: Scalars['Boolean']['output'];
};

export type InvitationResponse = {
  __typename?: 'InvitationResponse';
  invitationId?: Maybe<Scalars['String']['output']>;
  isNewUser: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type InvitationValidation = {
  __typename?: 'InvitationValidation';
  invitation?: Maybe<Invitation>;
  reason?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

/**
 * Level model
 * Define the Level model and its fields
 */
export type Level = {
  __typename?: 'Level';
  boltResults?: Maybe<Array<BoltResult>>;
  createdAt: Scalars['DateTime']['output'];
  drives?: Maybe<Array<Drive>>;
  id: Scalars['String']['output'];
  levelName: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/**
 * Location model
 * Define the Location model and its fields
 */
export type Location = {
  __typename?: 'Location';
  boltResults?: Maybe<Array<BoltResult>>;
  createdAt: Scalars['DateTime']['output'];
  driveId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  locationName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LocationDistribution = {
  __typename?: 'LocationDistribution';
  locationId: Scalars['String']['output'];
  locationName: Scalars['String']['output'];
  results: Array<BansheeRequest>;
  statusCounts: Array<StatusCount>;
  total: Scalars['Int']['output'];
};

/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type Mutation = {
  __typename?: 'Mutation';
  addCartItems: AddCartItemsResult;
  bansheeContactUs: BansheeContactUsResponse;
  bansheeSharePlotList: BansheeSharePlotListResponse;
  cancelOrder: BansheeOrder;
  cancelOrderItem: BansheeOrderItem;
  clearCart: Scalars['Boolean']['output'];
  completeInvitation: User;
  completeOrder: BansheeOrder;
  confirmPasswordReset: Scalars['Boolean']['output'];
  createBansheeRequest: BansheeRequest;
  createBansheeTemplate: BansheeTemplate;
  createBoltResult: BoltResult;
  createBoltResults: Array<BoltResult>;
  createCoffee: Coffee;
  createCompany: Company;
  createDrive: Drive;
  createGlobalInvitation: InvitationResponse;
  createInvitation: InvitationResponse;
  createLevel: Level;
  createLocation: Location;
  createSite: Site;
  createUserPermission: UserPermission;
  deleteBansheeRequest: BansheeRequest;
  deleteBansheeTemplate: BansheeTemplate;
  deleteCartItem: BansheeCartItem;
  fulfillOrderItem: BansheeOrderItem;
  removeBoltResult: BoltResult;
  removeBoltResults: Array<BoltResult>;
  removeCoffee: Coffee;
  removeCompany: Company;
  removeDrive: Drive;
  removeInvitation: Invitation;
  removeLevel: Level;
  removeLocation: Location;
  removeSite: Site;
  removeUser: User;
  removeUserPermission: UserPermission;
  requestPasswordReset: Scalars['Boolean']['output'];
  resendInvitation: Invitation;
  submitOrder: BansheeOrder;
  updateBansheeRequest: BansheeRequest;
  updateBansheeTemplate: BansheeTemplate;
  updateBoltResult: BoltResult;
  updateBoltResults: Array<BoltResult>;
  updateCoffee: Coffee;
  updateCompany: Company;
  updateDrive: Drive;
  updateLevel: Level;
  updateLocation: Location;
  updateNewBansheeCartItem: BansheeCartItem;
  updateSite: Site;
  updateUser: User;
  updateUserPermission: UserPermission;
  validateResetToken: Scalars['Boolean']['output'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationAddCartItemsArgs = {
  input: Array<AddCartItemInput>;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationBansheeContactUsArgs = {
  attachments?: InputMaybe<Array<Scalars['Upload']['input']>>;
  input: BansheeContactUsInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationBansheeSharePlotListArgs = {
  csv: Scalars['Upload']['input'];
  image: Scalars['Upload']['input'];
  input: BansheeSharePlotListInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCancelOrderArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCancelOrderItemArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationClearCartArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCompleteInvitationArgs = {
  input: CompleteInvitationInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCompleteOrderArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationConfirmPasswordResetArgs = {
  input: ConfirmPasswordResetInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateBansheeRequestArgs = {
  createBansheeRequestInput: CreateBansheeRequestInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateBansheeTemplateArgs = {
  createBansheeTemplateInput: BansheeTemplateInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateBoltResultArgs = {
  createBoltResultInput: CreateBoltResultInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateBoltResultsArgs = {
  createBoltResultsInput: Array<CreateBoltResultInput>;
  siteId: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateCoffeeArgs = {
  createCoffeeInput: CreateCoffeeInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateCompanyArgs = {
  createCompanyInput: CreateCompanyInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateDriveArgs = {
  createDriveInput: CreateDriveInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateGlobalInvitationArgs = {
  input: CreateGlobalInvitationInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateLevelArgs = {
  createLevelInput: CreateLevelInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateLocationArgs = {
  createLocationInput: CreateLocationInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateSiteArgs = {
  createSiteInput: CreateSiteInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationCreateUserPermissionArgs = {
  createUserPermissionInput: CreateUserPermissionInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationDeleteBansheeRequestArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationDeleteBansheeTemplateArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationDeleteCartItemArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationFulfillOrderItemArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveBoltResultArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveBoltResultsArgs = {
  ids: Array<Scalars['String']['input']>;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveCoffeeArgs = {
  id: Scalars['ID']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveCompanyArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveDriveArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveInvitationArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveLevelArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveLocationArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveSiteArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRemoveUserPermissionArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationResendInvitationArgs = {
  id: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationSubmitOrderArgs = {
  attachments?: InputMaybe<Array<Scalars['Upload']['input']>>;
  input: SubmitOrderInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateBansheeRequestArgs = {
  id: Scalars['String']['input'];
  updateBansheeRequestInput: UpdateBansheeRequestInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateBansheeTemplateArgs = {
  id: Scalars['String']['input'];
  updateBansheeTemplateInput: BansheeTemplateInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateBoltResultArgs = {
  id: Scalars['String']['input'];
  updateBoltResultInput: UpdateBoltResultInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateBoltResultsArgs = {
  updateBoltResultsInput: Array<UpdateBoltResultInput>;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateCoffeeArgs = {
  id: Scalars['ID']['input'];
  updateCoffeeInput: UpdateCoffeeInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateCompanyArgs = {
  id: Scalars['String']['input'];
  updateCompanyInput: UpdateCompanyInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateDriveArgs = {
  id: Scalars['String']['input'];
  updateDriveInput: UpdateDriveInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateLevelArgs = {
  id: Scalars['String']['input'];
  updateLevelInput: UpdateLevelInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateLocationArgs = {
  id: Scalars['String']['input'];
  updateLocationInput: UpdateLocationInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateNewBansheeCartItemArgs = {
  cartItemId: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  input: UpdateNewBansheeCartItemInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateSiteArgs = {
  id: Scalars['String']['input'];
  updateSiteInput: UpdateSiteInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  updatePasswordInput?: InputMaybe<UpdatePasswordInput>;
  updateUserInput: UpdateUserInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateUserPermissionArgs = {
  id: Scalars['String']['input'];
  updateUserPermissionInput: UpdateUserPermissionInput;
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationValidateResetTokenArgs = {
  input: ValidateResetTokenInput;
};

export type OrderFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<BansheeOrderStatus>;
};

export type OrdersResponse = {
  __typename?: 'OrdersResponse';
  results: Array<BansheeOrder>;
  totalRecords: Scalars['Int']['output'];
};

/**
 * Plan model
 * Define the Plan model and its fields
 */
export type Plan = {
  __typename?: 'Plan';
  applicationName: Scalars['String']['output'];
  companyId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiringDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  planLevel: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum PlanLevel {
  Bronze = 'BRONZE',
  Gold = 'GOLD',
  Inactive = 'INACTIVE',
  Silver = 'SILVER'
}

export type ProceqAttachment = {
  __typename?: 'ProceqAttachment';
  attachmentId: Scalars['String']['output'];
  attachmentType: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  filePath: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Int']['output']>;
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  measurementId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProceqData = {
  __typename?: 'ProceqData';
  attachmentIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  bansheeRequest?: Maybe<BansheeRequest>;
  comments: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdTimestamp?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  measurementId: Scalars['String']['output'];
  operator?: Maybe<Scalars['String']['output']>;
  proceqAttachments?: Maybe<Array<ProceqAttachment>>;
  rawDataZipId?: Maybe<Scalars['String']['output']>;
  rawDataZipPath?: Maybe<Scalars['String']['output']>;
  readings?: Maybe<Array<ProceqReading>>;
  status?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  updatedTimestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type ProceqLoginUrlResponse = {
  __typename?: 'ProceqLoginUrlResponse';
  url: Scalars['String']['output'];
};

export type ProceqReading = {
  __typename?: 'ProceqReading';
  analogueFilter?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  damping?: Maybe<Scalars['Int']['output']>;
  elongation?: Maybe<Scalars['Float']['output']>;
  frequency?: Maybe<Scalars['Float']['output']>;
  gain?: Maybe<Scalars['Float']['output']>;
  gate1MaximumAmplitude?: Maybe<Scalars['Float']['output']>;
  gate1SoundPathDistance?: Maybe<Scalars['Float']['output']>;
  gate1SoundPathDistanceInTimeUnit?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  indicationSetupFileName?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['Float']['output']>;
  measurementLevel?: Maybe<Scalars['Float']['output']>;
  measuringMode?: Maybe<Scalars['String']['output']>;
  readingIndex: Scalars['Int']['output'];
  referenceSamplingRate?: Maybe<Scalars['Int']['output']>;
  sampleAveraging?: Maybe<Scalars['Int']['output']>;
  start?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  voltage?: Maybe<Scalars['Int']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
  zeroOffset?: Maybe<Scalars['Float']['output']>;
};

export enum ProceqStatus {
  Broken = 'BROKEN',
  Elastic = 'ELASTIC',
  HighPlastic = 'HIGH_PLASTIC',
  LowPlastic = 'LOW_PLASTIC',
  NotMeasurable = 'NOT_MEASURABLE',
  Unmeasured = 'UNMEASURED'
}

export enum PullTestAbortReason {
  BoltEndDamageRigNotEngaging = 'BOLT_END_DAMAGE_RIG_NOT_ENGAGING',
  BrokenBoltNut = 'BROKEN_BOLT_NUT',
  HighAngleNotPerpendicular = 'HIGH_ANGLE_NOT_PERPENDICULAR',
  NotTestedVoidCavity = 'NOT_TESTED_VOID_CAVITY',
  PegNotExtruded = 'PEG_NOT_EXTRUDED',
  PullTestCollarInstalledBackwards = 'PULL_TEST_COLLAR_INSTALLED_BACKWARDS',
  RebarEjectedStopperCaught = 'REBAR_EJECTED_STOPPER_CAUGHT',
  TestStoppedInstallAngle = 'TEST_STOPPED_INSTALL_ANGLE'
}

/**
 * Query
 * Define the queries that can be made to the User model
 */
export type Query = {
  __typename?: 'Query';
  bansheeContactById?: Maybe<BansheeEmail>;
  bansheeContactUsInbox: BansheeContactUsInboxResponse;
  bansheeEventLogs: BansheeEventLogResponse;
  bansheeRequest: BansheeRequest;
  bansheeRequests: BansheeRequestResponse;
  bansheeSessionStats: Array<BansheeSessionStats>;
  bansheeStatusDistribution: BansheeStatusDistribution;
  boltResult: BoltResult;
  boltResults: BoltResultResponse;
  cartItems: Array<BansheeCartItem>;
  cartItemsStats: BansheeCartItemStats;
  coffee: Coffee;
  coffees: Array<Coffee>;
  companies: CompanyListResponse;
  company: Company;
  drive: Drive;
  drives: Array<Drive>;
  getApplication?: Maybe<Array<Application>>;
  getBansheeTemplateById?: Maybe<BansheeTemplate>;
  getBansheeTemplates: Array<BansheeTemplate>;
  getBoltTypes?: Maybe<Array<BoltType>>;
  getBoltTypesOptions: Array<EnumOption>;
  getPlanLevel?: Maybe<Array<PlanLevel>>;
  getProceqStatus?: Maybe<Array<ProceqStatus>>;
  getPullTestAbortReason?: Maybe<Array<PullTestAbortReason>>;
  getPullTestAbortReasonOptions: Array<EnumOption>;
  getResults: Array<Result>;
  getRingPosition?: Maybe<Array<RingPosition>>;
  getRingPositionOptions: Array<EnumOption>;
  getRoles: Array<Role>;
  hazards?: Maybe<Array<BoltResult>>;
  level: Level;
  levels: Array<Level>;
  location: Location;
  locations: Array<Location>;
  order: BansheeOrder;
  orders: OrdersResponse;
  pendingGlobalInvitations: Array<Invitation>;
  pendingInvitations: Array<Invitation>;
  proceqLoginUrl: ProceqLoginUrlResponse;
  site: Site;
  sites: Array<Site>;
  user: User;
  userPermission: UserPermission;
  userPermissions: Array<UserPermission>;
  users: Array<User>;
  validateInvitation: InvitationValidation;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeContactByIdArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeContactUsInboxArgs = {
  filter?: InputMaybe<BansheeContactUsInboxFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeEventLogsArgs = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeRequestArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeRequestsArgs = {
  activateNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  companyId?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  driveId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isBrokenBolt?: InputMaybe<Scalars['Boolean']['input']>;
  isNotMeasurable?: InputMaybe<Scalars['Boolean']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  measured?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeSessionStatsArgs = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  siteId?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBansheeStatusDistributionArgs = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBoltResultArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryBoltResultsArgs = {
  driveId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isHazard?: InputMaybe<Scalars['Boolean']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Array<Scalars['String']['input']>>;
  siteId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  withComment?: InputMaybe<Scalars['Boolean']['input']>;
  withImage?: InputMaybe<Scalars['Boolean']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryCartItemsArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryCartItemsStatsArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryCoffeeArgs = {
  id: Scalars['ID']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryCompanyArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryDriveArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryGetBansheeTemplateByIdArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryGetBansheeTemplatesArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryHazardsArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryLevelArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryLocationArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryOrdersArgs = {
  filter?: InputMaybe<OrderFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryPendingInvitationsArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryProceqLoginUrlArgs = {
  callbackUrl: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QuerySiteArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryUserPermissionArgs = {
  id: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryUsersArgs = {
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryValidateInvitationArgs = {
  id: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export enum Result {
  Abort = 'ABORT',
  Fail = 'FAIL',
  Pass = 'PASS'
}

export enum RingPosition {
  CenterBacks = 'CENTER_BACKS',
  LhBacks = 'LH_BACKS',
  LhFaceHigh = 'LH_FACE_HIGH',
  LhFaceLow = 'LH_FACE_LOW',
  LhShoulder = 'LH_SHOULDER',
  LhWallCenter = 'LH_WALL_CENTER',
  LhWallLower = 'LH_WALL_LOWER',
  LhWallUpper = 'LH_WALL_UPPER',
  RhBacks = 'RH_BACKS',
  RhFaceHigh = 'RH_FACE_HIGH',
  RhFaceLow = 'RH_FACE_LOW',
  RhShoulder = 'RH_SHOULDER',
  RhWallCenter = 'RH_WALL_CENTER',
  RhWallLower = 'RH_WALL_LOWER',
  RhWallUpper = 'RH_WALL_UPPER'
}

export enum Role {
  CompanyAdmin = 'COMPANY_ADMIN',
  CompanyUser = 'COMPANY_USER',
  SandvikAdmin = 'SANDVIK_ADMIN',
  SandvikTechnician = 'SANDVIK_TECHNICIAN'
}

/**
 * Site model
 * Define the Site model and its fields
 */
export type Site = {
  __typename?: 'Site';
  address: Scalars['String']['output'];
  boltResults?: Maybe<Array<BoltResult>>;
  city: Scalars['String']['output'];
  companyId: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  levels?: Maybe<Array<Level>>;
  postalCode: Scalars['String']['output'];
  siteName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SkippedBansheeRequest = {
  __typename?: 'SkippedBansheeRequest';
  bansheeRequestId: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type StatusCount = {
  __typename?: 'StatusCount';
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type SubmitOrderInput = {
  attachmentsName?: InputMaybe<Array<Scalars['String']['input']>>;
  comment: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
};

/**
 * UpdateBansheeRequestInput
 * Define the input fields to update an existing banshee request
 */
export type UpdateBansheeRequestInput = {
  activateNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  boltInstallationDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  boltType?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['String']['input']>;
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  driveId?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['Upload']['input']>>;
  isBrokenBolt?: InputMaybe<Scalars['Boolean']['input']>;
  isNotMeasurable?: InputMaybe<Scalars['Boolean']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  locationDetails?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  measured?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  ringPosition?: InputMaybe<RingPosition>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateBoltResultInput
 * Define the input fields to update an existing boltResult
 * Optional are marked without the exclamation mark
 */
export type UpdateBoltResultInput = {
  abortReason?: InputMaybe<Scalars['String']['input']>;
  boltNumber?: InputMaybe<Scalars['Int']['input']>;
  boltType?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  hazardCompletedDate?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  isHazard?: InputMaybe<Scalars['Boolean']['input']>;
  measuredAt?: InputMaybe<Scalars['DateTime']['input']>;
  peakDisplacement?: InputMaybe<Array<Scalars['Int']['input']>>;
  peakLoad?: InputMaybe<Array<Scalars['Int']['input']>>;
  positionInRing?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateCoffeeInput
 * Define the input fields to update an existing coffee
 * Optional are marked without the exclamation mark
 */
export type UpdateCoffeeInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  flavors?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateCompanyInput
 * Define the input fields to update an existing company
 * Optional are marked without the exclamation mark
 */
export type UpdateCompanyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyContactEmail?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orgNumber?: InputMaybe<Scalars['String']['input']>;
  plans?: InputMaybe<Array<UpdatePlanInput>>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  sandvikAdminUserId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateDriveInput
 * Define the input fields to update an existing drive
 * Optional are marked without the exclamation mark
 */
export type UpdateDriveInput = {
  driveName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateLevelInput
 * Define the input fields to update an existing level
 * Optional are marked without the exclamation mark
 */
export type UpdateLevelInput = {
  levelName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateLocationInput
 * Define the input fields to update an existing location
 * Optional are marked without the exclamation mark
 */
export type UpdateLocationInput = {
  locationName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNewBansheeCartItemInput = {
  driveId?: InputMaybe<Scalars['String']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePasswordInput = {
  confirmPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdatePlanInput
 * Define the input fields to update the plans
 */
export type UpdatePlanInput = {
  applicationName: Scalars['String']['input'];
  expiringDate?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  planLevel?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateSiteInput
 * Define the input fields to update an existing site
 * Optional are marked without the exclamation mark
 */
export type UpdateSiteInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateUserInput
 * Define the input fields to update an existing user
 * Optional are marked without the exclamation mark
 */
export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  globalRole?: InputMaybe<Scalars['String']['input']>;
  isGlobalVisibility?: InputMaybe<Scalars['Boolean']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  workPlace?: InputMaybe<Scalars['String']['input']>;
};

/**
 * UpdateUserPermissionInput
 * Define the input fields to update an existing userPermission
 * Optional are marked without the exclamation mark
 */
export type UpdateUserPermissionInput = {
  appsAccess?: InputMaybe<Array<Scalars['String']['input']>>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/**
 * User model
 * Define the User model and its fields
 */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  globalRole?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isGlobalVisibility?: Maybe<Scalars['Boolean']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userPermissions?: Maybe<Array<UserPermission>>;
  workPlace: Scalars['String']['output'];
};

/**
 * UserPermission model
 * Define the UserPermission model and its fields
 */
export type UserPermission = {
  __typename?: 'UserPermission';
  appsAccess: Array<Scalars['String']['output']>;
  companyId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type ValidateResetTokenInput = {
  email: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type BansheeRequestConfigQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BansheeRequestConfigQuery = { __typename?: 'Query', bansheeRequest: { __typename?: 'BansheeRequest', id: string, serialNumber: string, name?: string | null, boltInstallationDateTime?: any | null, period: number, coordinates?: any | null, boltType?: string | null, locationDetails?: string | null, comment?: string | null, activateNotifications?: boolean | null, ringPosition: string, companyId: string, boltTypeConstant?: { __typename?: 'BansheeBoltTypeConstant', lowPlasticLimit: number, elasticLimit: number } | null, site?: { __typename?: 'Site', id: string, siteName: string } | null, level?: { __typename?: 'Level', id: string, levelName: string } | null, drive?: { __typename?: 'Drive', id: string, driveName: string } | null, location?: { __typename?: 'Location', id: string, locationName: string } | null } };

export type UpdateBansheeRequestMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateBansheeRequestInput: UpdateBansheeRequestInput;
}>;


export type UpdateBansheeRequestMutation = { __typename?: 'Mutation', updateBansheeRequest: { __typename?: 'BansheeRequest', id: string } };

export type HierarchyQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type HierarchyQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, sites?: Array<{ __typename?: 'Site', id: string, siteName: string, levels?: Array<{ __typename?: 'Level', id: string, levelName: string, drives?: Array<{ __typename?: 'Drive', id: string, driveName: string, locations?: Array<{ __typename?: 'Location', id: string, locationName: string }> | null }> | null }> | null }> | null } };

export type BansheeDetailQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BansheeDetailQueryQuery = { __typename?: 'Query', bansheeRequest: { __typename?: 'BansheeRequest', id: string, serialNumber: string, name?: string | null, boltInstallationDateTime?: any | null, period: number, coordinates?: any | null, boltType?: string | null, locationDetails?: string | null, comment?: string | null, activateNotifications?: boolean | null, ringPosition: string, companyId: string, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, createdTimestamp?: any | null, dueDate?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null, boltTypeConstant?: { __typename?: 'BansheeBoltTypeConstant', lowPlasticLimit: number, elasticLimit: number } | null, site?: { __typename?: 'Site', id: string, siteName: string } | null, level?: { __typename?: 'Level', id: string, levelName: string } | null, drive?: { __typename?: 'Drive', id: string, driveName: string } | null, location?: { __typename?: 'Location', id: string, locationName: string } | null } };

export type BansheeRequestsListQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type BansheeRequestsListQuery = { __typename?: 'Query', bansheeRequests: { __typename?: 'BansheeRequestResponse', results: Array<{ __typename?: 'BansheeRequest', id: string, serialNumber: string, comment?: string | null, site?: { __typename?: 'Site', siteName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, level?: { __typename?: 'Level', levelName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, createdTimestamp?: any | null, updatedTimestamp?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null, eventLogs?: Array<{ __typename?: 'BansheeEventLog', createdAt: any, eventType: string, previousStatus: string, newStatus: string }> | null }> } };

export type BansheePageStatusDistributionQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type BansheePageStatusDistributionQuery = { __typename?: 'Query', bansheeStatusDistribution: { __typename?: 'BansheeStatusDistribution', total: number, statusCounts: Array<{ __typename?: 'StatusCount', status: string, count: number }>, byLocation?: Array<{ __typename?: 'LocationDistribution', locationId: string, locationName: string, total: number, statusCounts: Array<{ __typename?: 'StatusCount', status: string, count: number }> }> | null } };

export type CartItemsQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type CartItemsQuery = { __typename?: 'Query', cartItems: Array<{ __typename?: 'BansheeCartItem', id: string, itemType: BansheeCartItemType, name?: string | null, quantity: number, bansheeRequestId?: string | null, location?: { __typename?: 'Location', locationName: string } | null, bansheeRequest?: { __typename?: 'BansheeRequest', serialNumber: string, location?: { __typename?: 'Location', locationName: string } | null } | null }> };

export type SubmitOrderMutationVariables = Exact<{
  input: SubmitOrderInput;
  attachments?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;


export type SubmitOrderMutation = { __typename?: 'Mutation', submitOrder: { __typename?: 'BansheeOrder', id: string } };

export type DeleteCartItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCartItemMutation = { __typename?: 'Mutation', deleteCartItem: { __typename?: 'BansheeCartItem', id: string } };

export type UpdateNewBansheeCartItemMutationVariables = Exact<{
  companyId: Scalars['String']['input'];
  cartItemId: Scalars['String']['input'];
  input: UpdateNewBansheeCartItemInput;
}>;


export type UpdateNewBansheeCartItemMutation = { __typename?: 'Mutation', updateNewBansheeCartItem: { __typename?: 'BansheeCartItem', id: string, quantity: number } };

export type BansheeStatusDistributionQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
}>;


export type BansheeStatusDistributionQuery = { __typename?: 'Query', bansheeStatusDistribution: { __typename?: 'BansheeStatusDistribution', total: number, statusCounts: Array<{ __typename?: 'StatusCount', status: string, count: number }> } };

export type OverviewBansheeRequestsListQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
}>;


export type OverviewBansheeRequestsListQuery = { __typename?: 'Query', bansheeRequests: { __typename?: 'BansheeRequestResponse', results: Array<{ __typename?: 'BansheeRequest', id: string, serialNumber: string, comment?: string | null, site?: { __typename?: 'Site', siteName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, level?: { __typename?: 'Level', levelName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, dueDate?: any | null, createdTimestamp?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null, eventLogs?: Array<{ __typename?: 'BansheeEventLog', createdAt: any, eventType: string, previousStatus: string, newStatus: string }> | null }> } };

export type TemplateHierarchyQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type TemplateHierarchyQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, sites?: Array<{ __typename?: 'Site', id: string, siteName: string, levels?: Array<{ __typename?: 'Level', id: string, levelName: string, drives?: Array<{ __typename?: 'Drive', id: string, driveName: string, locations?: Array<{ __typename?: 'Location', id: string, locationName: string }> | null }> | null }> | null }> | null } };

export type SchedulerOrdersQueryVariables = Exact<{
  filter?: InputMaybe<OrderFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SchedulerOrdersQuery = { __typename?: 'Query', orders: { __typename?: 'OrdersResponse', results: Array<{ __typename?: 'BansheeOrder', id: string, orderItems: Array<{ __typename?: 'BansheeOrderItem', id: string, status: BansheeOrderItemStatus, bansheeRequestId?: string | null }> }> } };

export type AddCartItemsMutationVariables = Exact<{
  input: Array<AddCartItemInput> | AddCartItemInput;
}>;


export type AddCartItemsMutation = { __typename?: 'Mutation', addCartItems: { __typename?: 'AddCartItemsResult', added: Array<{ __typename?: 'BansheeCartItem', id: string, itemType: BansheeCartItemType }>, skipped: Array<{ __typename?: 'SkippedBansheeRequest', bansheeRequestId: string, serialNumber?: string | null, reason: string }> } };

export type BansheeSchedulerListQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
}>;


export type BansheeSchedulerListQuery = { __typename?: 'Query', bansheeRequests: { __typename?: 'BansheeRequestResponse', results: Array<{ __typename?: 'BansheeRequest', id: string, serialNumber: string, period: number, comment?: string | null, site?: { __typename?: 'Site', siteName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, level?: { __typename?: 'Level', levelName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, createdTimestamp?: any | null, updatedTimestamp?: any | null, dueDate?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null, eventLogs?: Array<{ __typename?: 'BansheeEventLog', createdAt: any, eventType: string, previousStatus: string, newStatus: string }> | null }> } };

export type SiteInfoHierarchyQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type SiteInfoHierarchyQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string, plans?: Array<{ __typename?: 'Plan', id: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null, sites?: Array<{ __typename?: 'Site', id: string, siteName: string, levels?: Array<{ __typename?: 'Level', id: string, levelName: string, drives?: Array<{ __typename?: 'Drive', id: string, driveName: string, locations?: Array<{ __typename?: 'Location', id: string, locationName: string }> | null }> | null }> | null }> | null } };

export type SiteInfoUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type SiteInfoUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, fullName: string, userPermissions?: Array<{ __typename?: 'UserPermission', id: string, role: string, appsAccess: Array<string> }> | null }> };

export type GetBansheeTemplatesQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetBansheeTemplatesQuery = { __typename?: 'Query', getBansheeTemplates: Array<{ __typename?: 'BansheeTemplate', id: string, templateName: string }> };

export type GetBansheeTemplateByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBansheeTemplateByIdQuery = { __typename?: 'Query', getBansheeTemplateById?: { __typename?: 'BansheeTemplate', id: string, templateName: string, period?: number | null, boltInstallationDateTime?: any | null, siteId?: string | null, levelId?: string | null, driveId?: string | null, locationId?: string | null, locationDetails?: string | null, coordinates?: any | null, comment?: string | null, activateNotifications?: boolean | null, ringPosition?: RingPosition | null } | null };

export type CreateBansheeTemplateMutationVariables = Exact<{
  createBansheeTemplateInput: BansheeTemplateInput;
}>;


export type CreateBansheeTemplateMutation = { __typename?: 'Mutation', createBansheeTemplate: { __typename?: 'BansheeTemplate', id: string, templateName: string } };

export type UpdateBansheeTemplateMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateBansheeTemplateInput: BansheeTemplateInput;
}>;


export type UpdateBansheeTemplateMutation = { __typename?: 'Mutation', updateBansheeTemplate: { __typename?: 'BansheeTemplate', id: string, templateName: string } };

export type DeleteBansheeTemplateMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBansheeTemplateMutation = { __typename?: 'Mutation', deleteBansheeTemplate: { __typename?: 'BansheeTemplate', id: string } };

export type BansheeRequestDetailQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BansheeRequestDetailQuery = { __typename?: 'Query', bansheeRequest: { __typename?: 'BansheeRequest', id: string, serialNumber: string, boltInstallationDateTime?: any | null, period: number, coordinates?: any | null, boltType?: string | null, site?: { __typename?: 'Site', siteName: string } | null, level?: { __typename?: 'Level', levelName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, createdTimestamp?: any | null, dueDate?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null, boltTypeConstant?: { __typename?: 'BansheeBoltTypeConstant', lowPlasticLimit: number, elasticLimit: number } | null } };

export type BansheeDetailEventQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type BansheeDetailEventQueryQuery = { __typename?: 'Query', bansheeRequest: { __typename?: 'BansheeRequest', id: string, serialNumber: string, boltInstallationDateTime?: any | null, period: number, coordinates?: any | null, boltType?: string | null, site?: { __typename?: 'Site', siteName: string } | null, level?: { __typename?: 'Level', levelName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, boltTypeConstant?: { __typename?: 'BansheeBoltTypeConstant', lowPlasticLimit: number, elasticLimit: number } | null, proceqData?: Array<{ __typename?: 'ProceqData', status?: string | null, dueDate?: any | null, createdTimestamp?: any | null, readings?: Array<{ __typename?: 'ProceqReading', elongation?: number | null, status?: string | null }> | null }> | null } };

export type EventsPageTableQueryQueryVariables = Exact<{
  companyId?: InputMaybe<Scalars['String']['input']>;
}>;


export type EventsPageTableQueryQuery = { __typename?: 'Query', bansheeEventLogs: { __typename?: 'BansheeEventLogResponse', totalRecords: number, results: Array<{ __typename?: 'BansheeEventLog', id: string, createdAt: any, eventType: string, previousStatus: string, newStatus: string, bansheeRequest?: { __typename?: 'BansheeRequest', serialNumber: string, id: string, location?: { __typename?: 'Location', locationName: string } | null } | null }> } };

export type GetCompanyNameQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyNameQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string } };

export type CartItemsStatsQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type CartItemsStatsQuery = { __typename?: 'Query', cartItemsStats: { __typename?: 'BansheeCartItemStats', newBanshee: number, serviceExisting: number, total: number } };

export type BansheeContactUsMutationVariables = Exact<{
  input: BansheeContactUsInput;
  attachments?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;


export type BansheeContactUsMutation = { __typename?: 'Mutation', bansheeContactUs: { __typename?: 'BansheeContactUsResponse', success: boolean, message?: string | null } };

export type BansheeSharePlotListMutationVariables = Exact<{
  input: BansheeSharePlotListInput;
  image: Scalars['Upload']['input'];
  csv: Scalars['Upload']['input'];
}>;


export type BansheeSharePlotListMutation = { __typename?: 'Mutation', bansheeSharePlotList: { __typename?: 'BansheeSharePlotListResponse', success: boolean, sentTo?: string | null, message?: string | null } };


export const BansheeRequestConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BansheeRequestConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"boltInstallationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"locationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"activateNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"ringPosition"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"boltTypeConstant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowPlasticLimit"}},{"kind":"Field","name":{"kind":"Name","value":"elasticLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]} as unknown as DocumentNode<BansheeRequestConfigQuery, BansheeRequestConfigQueryVariables>;
export const UpdateBansheeRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBansheeRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateBansheeRequestInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBansheeRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBansheeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateBansheeRequestInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateBansheeRequestInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateBansheeRequestMutation, UpdateBansheeRequestMutationVariables>;
export const HierarchyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Hierarchy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<HierarchyQuery, HierarchyQueryVariables>;
export const BansheeDetailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheeDetailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"boltInstallationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"locationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"activateNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"ringPosition"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boltTypeConstant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowPlasticLimit"}},{"kind":"Field","name":{"kind":"Name","value":"elasticLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]} as unknown as DocumentNode<BansheeDetailQueryQuery, BansheeDetailQueryQueryVariables>;
export const BansheeRequestsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheeRequestsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"previousStatus"}},{"kind":"Field","name":{"kind":"Name","value":"newStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BansheeRequestsListQuery, BansheeRequestsListQueryVariables>;
export const BansheePageStatusDistributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheePageStatusDistribution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeStatusDistribution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"statusCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"byLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"statusCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BansheePageStatusDistributionQuery, BansheePageStatusDistributionQueryVariables>;
export const CartItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cartItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cartItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"itemType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"bansheeRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CartItemsQuery, CartItemsQueryVariables>;
export const SubmitOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitOrderInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SubmitOrderMutation, SubmitOrderMutationVariables>;
export const DeleteCartItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCartItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCartItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteCartItemMutation, DeleteCartItemMutationVariables>;
export const UpdateNewBansheeCartItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNewBansheeCartItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cartItemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNewBansheeCartItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNewBansheeCartItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cartItemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cartItemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<UpdateNewBansheeCartItemMutation, UpdateNewBansheeCartItemMutationVariables>;
export const BansheeStatusDistributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheeStatusDistribution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeStatusDistribution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"statusCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<BansheeStatusDistributionQuery, BansheeStatusDistributionQueryVariables>;
export const OverviewBansheeRequestsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"overviewBansheeRequestsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"previousStatus"}},{"kind":"Field","name":{"kind":"Name","value":"newStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OverviewBansheeRequestsListQuery, OverviewBansheeRequestsListQueryVariables>;
export const TemplateHierarchyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateHierarchy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TemplateHierarchyQuery, TemplateHierarchyQueryVariables>;
export const SchedulerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"schedulerOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bansheeRequestId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SchedulerOrdersQuery, SchedulerOrdersQueryVariables>;
export const AddCartItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addCartItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddCartItemInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCartItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"added"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"itemType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skipped"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]} as unknown as DocumentNode<AddCartItemsMutation, AddCartItemsMutationVariables>;
export const BansheeSchedulerListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheeSchedulerList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"previousStatus"}},{"kind":"Field","name":{"kind":"Name","value":"newStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BansheeSchedulerListQuery, BansheeSchedulerListQueryVariables>;
export const SiteInfoHierarchyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"siteInfoHierarchy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SiteInfoHierarchyQuery, SiteInfoHierarchyQueryVariables>;
export const SiteInfoUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"siteInfoUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"appsAccess"}}]}}]}}]}}]} as unknown as DocumentNode<SiteInfoUsersQuery, SiteInfoUsersQueryVariables>;
export const GetBansheeTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBansheeTemplates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBansheeTemplates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}}]}}]}}]} as unknown as DocumentNode<GetBansheeTemplatesQuery, GetBansheeTemplatesQueryVariables>;
export const GetBansheeTemplateByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBansheeTemplateById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBansheeTemplateById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"boltInstallationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"locationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"activateNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"ringPosition"}}]}}]}}]} as unknown as DocumentNode<GetBansheeTemplateByIdQuery, GetBansheeTemplateByIdQueryVariables>;
export const CreateBansheeTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBansheeTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createBansheeTemplateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BansheeTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBansheeTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createBansheeTemplateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createBansheeTemplateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}}]}}]}}]} as unknown as DocumentNode<CreateBansheeTemplateMutation, CreateBansheeTemplateMutationVariables>;
export const UpdateBansheeTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBansheeTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateBansheeTemplateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BansheeTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBansheeTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateBansheeTemplateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateBansheeTemplateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}}]}}]}}]} as unknown as DocumentNode<UpdateBansheeTemplateMutation, UpdateBansheeTemplateMutationVariables>;
export const DeleteBansheeTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBansheeTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBansheeTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteBansheeTemplateMutation, DeleteBansheeTemplateMutationVariables>;
export const BansheeRequestDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BansheeRequestDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltInstallationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boltTypeConstant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowPlasticLimit"}},{"kind":"Field","name":{"kind":"Name","value":"elasticLimit"}}]}}]}}]}}]} as unknown as DocumentNode<BansheeRequestDetailQuery, BansheeRequestDetailQueryVariables>;
export const BansheeDetailEventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bansheeDetailEventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltInstallationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boltTypeConstant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowPlasticLimit"}},{"kind":"Field","name":{"kind":"Name","value":"elasticLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"proceqData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"readings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elongation"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BansheeDetailEventQueryQuery, BansheeDetailEventQueryQueryVariables>;
export const EventsPageTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventsPageTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeEventLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"previousStatus"}},{"kind":"Field","name":{"kind":"Name","value":"newStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bansheeRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventsPageTableQueryQuery, EventsPageTableQueryQueryVariables>;
export const GetCompanyNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCompanyNameQuery, GetCompanyNameQueryVariables>;
export const CartItemsStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cartItemsStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cartItemsStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newBanshee"}},{"kind":"Field","name":{"kind":"Name","value":"serviceExisting"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<CartItemsStatsQuery, CartItemsStatsQueryVariables>;
export const BansheeContactUsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bansheeContactUs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BansheeContactUsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeContactUs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<BansheeContactUsMutation, BansheeContactUsMutationVariables>;
export const BansheeSharePlotListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bansheeSharePlotList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BansheeSharePlotListInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"csv"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bansheeSharePlotList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"csv"},"value":{"kind":"Variable","name":{"kind":"Name","value":"csv"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"sentTo"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<BansheeSharePlotListMutation, BansheeSharePlotListMutationVariables>;