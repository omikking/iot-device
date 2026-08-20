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
  Hydra = 'HYDRA',
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

export type CreateHydraboltInput = {
  boltLength: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  drawingNumber?: InputMaybe<Scalars['String']['input']>;
  elasticLimit: Scalars['Float']['input'];
  highPlasticLimit: Scalars['Float']['input'];
  initialWavelength: Array<Scalars['Float']['input']>;
  lowPlasticLimit: Scalars['Float']['input'];
  maxCalibrationFactor: Scalars['Float']['input'];
  minCalibrationFactor: Scalars['Float']['input'];
  numberOfFBG: Scalars['Int']['input'];
  partNumber: Scalars['String']['input'];
  positionOfFBGs: Array<Scalars['Float']['input']>;
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

export type CreateOpticboltSpectrumInput = {
  amplitude20?: InputMaybe<Scalars['Float']['input']>;
  amplitude100?: InputMaybe<Scalars['Float']['input']>;
  calibrationFactor?: InputMaybe<Scalars['Float']['input']>;
  fbgIndex: Scalars['Int']['input'];
  load20?: InputMaybe<Scalars['Float']['input']>;
  load100?: InputMaybe<Scalars['Float']['input']>;
  peak20Nm?: InputMaybe<Scalars['Float']['input']>;
  peak100Nm?: InputMaybe<Scalars['Float']['input']>;
  peakInitialNm?: InputMaybe<Scalars['Float']['input']>;
  strain20?: InputMaybe<Scalars['Float']['input']>;
  strain100?: InputMaybe<Scalars['Float']['input']>;
  time20Ms?: InputMaybe<Scalars['Int']['input']>;
  time100Ms?: InputMaybe<Scalars['Int']['input']>;
  wavelength20?: InputMaybe<Scalars['Float']['input']>;
  wavelength100?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateOpticboltTestResultWithSpectrumsInput = {
  boltType?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  drawingNumber?: InputMaybe<Scalars['String']['input']>;
  fibreCheck1?: InputMaybe<Scalars['Boolean']['input']>;
  fibreCheck2?: InputMaybe<Scalars['Boolean']['input']>;
  fibreCheck3?: InputMaybe<Scalars['Boolean']['input']>;
  psi20?: InputMaybe<Scalars['Int']['input']>;
  psi100?: InputMaybe<Scalars['Int']['input']>;
  result: Scalars['String']['input'];
  serialNumber: Scalars['String']['input'];
  spectrums: Array<CreateOpticboltSpectrumInput>;
  testedAt: Scalars['DateTime']['input'];
  testedBy: Scalars['String']['input'];
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

export type GetProceqTokenStatusResponse = {
  __typename?: 'GetProceqTokenStatusResponse';
  canRefresh: Scalars['Boolean']['output'];
  expiresAt?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type Hydrabolt = {
  __typename?: 'Hydrabolt';
  boltLength: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  drawingNumber?: Maybe<Scalars['String']['output']>;
  elasticLimit: Scalars['Float']['output'];
  highPlasticLimit: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  initialWavelength: Array<Scalars['Float']['output']>;
  lowPlasticLimit: Scalars['Float']['output'];
  maxCalibrationFactor: Scalars['Float']['output'];
  minCalibrationFactor: Scalars['Float']['output'];
  numberOfFBG: Scalars['Int']['output'];
  partNumber: Scalars['String']['output'];
  positionOfFBGs: Array<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
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
  driveName: Scalars['String']['output'];
  levelName: Scalars['String']['output'];
  locationId: Scalars['String']['output'];
  locationName: Scalars['String']['output'];
  results: Array<BansheeRequest>;
  siteName: Scalars['String']['output'];
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
  createHydrabolt: Hydrabolt;
  createInvitation: InvitationResponse;
  createLevel: Level;
  createLocation: Location;
  createOpticboltTestResultWithSpectrums: OpticboltTestResult;
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
  updateHydrabolt: Hydrabolt;
  updateLevel: Level;
  updateLocation: Location;
  updateNewBansheeCartItem: BansheeCartItem;
  updateOpticboltSpectrum: OpticboltSpectrum;
  updateOpticboltTestResult: OpticboltTestResult;
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
export type MutationCreateHydraboltArgs = {
  input: CreateHydraboltInput;
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
export type MutationCreateOpticboltTestResultWithSpectrumsArgs = {
  input: CreateOpticboltTestResultWithSpectrumsInput;
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
export type MutationUpdateHydraboltArgs = {
  input: UpdateHydraboltInput;
  partNumber: Scalars['String']['input'];
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
export type MutationUpdateOpticboltSpectrumArgs = {
  fbgIndex: Scalars['Int']['input'];
  input: UpdateOpticboltSpectrumInput;
  serialNumber: Scalars['String']['input'];
};


/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type MutationUpdateOpticboltTestResultArgs = {
  input: UpdateOpticboltTestResultInput;
  serialNumber: Scalars['String']['input'];
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

export type OpticboltSpectrum = {
  __typename?: 'OpticboltSpectrum';
  amplitude20?: Maybe<Scalars['Float']['output']>;
  amplitude100?: Maybe<Scalars['Float']['output']>;
  calibrationFactor?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fbgIndex: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  load20?: Maybe<Scalars['Float']['output']>;
  load100?: Maybe<Scalars['Float']['output']>;
  peak20Nm?: Maybe<Scalars['Float']['output']>;
  peak100Nm?: Maybe<Scalars['Float']['output']>;
  peakInitialNm?: Maybe<Scalars['Float']['output']>;
  strain20?: Maybe<Scalars['Float']['output']>;
  strain100?: Maybe<Scalars['Float']['output']>;
  testResultId: Scalars['String']['output'];
  time20Ms?: Maybe<Scalars['Int']['output']>;
  time100Ms?: Maybe<Scalars['Int']['output']>;
  wavelength20?: Maybe<Scalars['Float']['output']>;
  wavelength100?: Maybe<Scalars['Float']['output']>;
};

export type OpticboltTestResult = {
  __typename?: 'OpticboltTestResult';
  boltType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  drawingNumber?: Maybe<Scalars['String']['output']>;
  fibreCheck1: Scalars['Boolean']['output'];
  fibreCheck2: Scalars['Boolean']['output'];
  fibreCheck3: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  psi20?: Maybe<Scalars['Int']['output']>;
  psi100?: Maybe<Scalars['Int']['output']>;
  result: Scalars['String']['output'];
  serialNumber: Scalars['String']['output'];
  spectrums: Array<OpticboltSpectrum>;
  testedAt: Scalars['DateTime']['output'];
  testedBy: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
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
  getProceqTokenStatus: GetProceqTokenStatusResponse;
  getPullTestAbortReason?: Maybe<Array<PullTestAbortReason>>;
  getPullTestAbortReasonOptions: Array<EnumOption>;
  getResults: Array<Result>;
  getRingPosition?: Maybe<Array<RingPosition>>;
  getRingPositionOptions: Array<EnumOption>;
  getRoles: Array<Role>;
  hazards?: Maybe<Array<BoltResult>>;
  hydraboltByPartNumber?: Maybe<Hydrabolt>;
  hydrabolts: Array<Hydrabolt>;
  level: Level;
  levels: Array<Level>;
  location: Location;
  locations: Array<Location>;
  opticboltSpectrumsBySerialNumber: Array<OpticboltSpectrum>;
  opticboltTestResults: Array<OpticboltTestResult>;
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
export type QueryHydraboltByPartNumberArgs = {
  partNumber: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryHydraboltsArgs = {
  since?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryOpticboltSpectrumsBySerialNumberArgs = {
  serialNumber: Scalars['String']['input'];
};


/**
 * Query
 * Define the queries that can be made to the User model
 */
export type QueryOpticboltTestResultsArgs = {
  since?: InputMaybe<Scalars['DateTime']['input']>;
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

export type UpdateHydraboltInput = {
  boltLength?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  drawingNumber?: InputMaybe<Scalars['String']['input']>;
  elasticLimit?: InputMaybe<Scalars['Float']['input']>;
  highPlasticLimit?: InputMaybe<Scalars['Float']['input']>;
  initialWavelength?: InputMaybe<Array<Scalars['Float']['input']>>;
  lowPlasticLimit?: InputMaybe<Scalars['Float']['input']>;
  maxCalibrationFactor?: InputMaybe<Scalars['Float']['input']>;
  minCalibrationFactor?: InputMaybe<Scalars['Float']['input']>;
  numberOfFBG?: InputMaybe<Scalars['Int']['input']>;
  partNumber?: InputMaybe<Scalars['String']['input']>;
  positionOfFBGs?: InputMaybe<Array<Scalars['Float']['input']>>;
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

export type UpdateOpticboltSpectrumInput = {
  amplitude20?: InputMaybe<Scalars['Float']['input']>;
  amplitude100?: InputMaybe<Scalars['Float']['input']>;
  calibrationFactor?: InputMaybe<Scalars['Float']['input']>;
  fbgIndex: Scalars['Int']['input'];
  load20?: InputMaybe<Scalars['Float']['input']>;
  load100?: InputMaybe<Scalars['Float']['input']>;
  peak20Nm?: InputMaybe<Scalars['Float']['input']>;
  peak100Nm?: InputMaybe<Scalars['Float']['input']>;
  peakInitialNm?: InputMaybe<Scalars['Float']['input']>;
  strain20?: InputMaybe<Scalars['Float']['input']>;
  strain100?: InputMaybe<Scalars['Float']['input']>;
  time20Ms?: InputMaybe<Scalars['Int']['input']>;
  time100Ms?: InputMaybe<Scalars['Int']['input']>;
  wavelength20?: InputMaybe<Scalars['Float']['input']>;
  wavelength100?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateOpticboltTestResultInput = {
  boltType?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  drawingNumber?: InputMaybe<Scalars['String']['input']>;
  fibreCheck1?: InputMaybe<Scalars['Boolean']['input']>;
  fibreCheck2?: InputMaybe<Scalars['Boolean']['input']>;
  fibreCheck3?: InputMaybe<Scalars['Boolean']['input']>;
  psi20?: InputMaybe<Scalars['Int']['input']>;
  psi100?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  spectrums?: InputMaybe<Array<UpdateOpticboltSpectrumInput>>;
  testedAt?: InputMaybe<Scalars['DateTime']['input']>;
  testedBy?: InputMaybe<Scalars['String']['input']>;
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

export type GetBoltResultQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  siteId?: InputMaybe<Scalars['String']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  driveId?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  isHazard?: InputMaybe<Scalars['Boolean']['input']>;
  withImage?: InputMaybe<Scalars['Boolean']['input']>;
  withComment?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetBoltResultQuery = { __typename?: 'Query', boltResults: { __typename?: 'BoltResultResponse', totalRecords: number, failedCount: number, hazardCount: number, passedCount: number, averageTons?: number | null, results: Array<{ __typename?: 'BoltResult', id: string, createdAt: any, updatedAt: any, measuredAt: any, boltNumber: number, boltType: string, peakLoad: Array<number>, peakDisplacement: Array<number>, positionInRing: string, result: string, isHazard: boolean, hazardCompletedDate?: Array<any> | null, abortReason?: string | null, comment?: string | null, image?: string | null, siteId: string, levelId: string, driveId: string, locationId: string, userId: string, site?: { __typename?: 'Site', siteName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, level?: { __typename?: 'Level', levelName: string } | null }> } };

export type GetAllBoltResultsQueryVariables = Exact<{
  siteId?: InputMaybe<Scalars['String']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  driveId?: InputMaybe<Scalars['String']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  isHazard?: InputMaybe<Scalars['Boolean']['input']>;
  withImage?: InputMaybe<Scalars['Boolean']['input']>;
  withComment?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetAllBoltResultsQuery = { __typename?: 'Query', boltResults: { __typename?: 'BoltResultResponse', totalRecords: number, results: Array<{ __typename?: 'BoltResult', id: string, createdAt: any, updatedAt: any, measuredAt: any, boltNumber: number, boltType: string, peakLoad: Array<number>, peakDisplacement: Array<number>, positionInRing: string, result: string, comment?: string | null, isHazard: boolean, abortReason?: string | null, level?: { __typename?: 'Level', levelName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null }> } };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyQuery = { __typename?: 'Query', company: { __typename?: 'Company', name: string, sites?: Array<{ __typename?: 'Site', id: string, name: string, levels?: Array<{ __typename?: 'Level', id: string, name: string, drives?: Array<{ __typename?: 'Drive', id: string, name: string, locations?: Array<{ __typename?: 'Location', id: string, name: string }> | null }> | null }> | null }> | null } };

export type GetHazardsIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetHazardsIdQuery = { __typename?: 'Query', hazards?: Array<{ __typename?: 'BoltResult', id: string, isHazard: boolean }> | null };

export type GetCompanyNameQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyNameQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string } };

export type GetHazardDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetHazardDetailsQuery = { __typename?: 'Query', hazards?: Array<{ __typename?: 'BoltResult', abortReason?: string | null, boltNumber: number, boltType: string, comment?: string | null, createdAt: any, measuredAt: any, driveId: string, hazardCompletedDate?: Array<any> | null, id: string, image?: string | null, isHazard: boolean, levelId: string, locationId: string, peakDisplacement: Array<number>, peakLoad: Array<number>, positionInRing: string, result: string, siteId: string, updatedAt: any, userId: string }> | null };

export type GetLevelDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetLevelDetailsQuery = { __typename?: 'Query', level: { __typename?: 'Level', id: string, levelName: string, siteId: string } };

export type GetDriveDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDriveDetailsQuery = { __typename?: 'Query', drive: { __typename?: 'Drive', id: string, driveName: string } };

export type GetLocationDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetLocationDetailsQuery = { __typename?: 'Query', location: { __typename?: 'Location', id: string, locationName: string } };

export type GetNameDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetNameDetailsQuery = { __typename?: 'Query', user: { __typename?: 'User', fullName: string } };

export type GetSiteNameQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetSiteNameQuery = { __typename?: 'Query', site: { __typename?: 'Site', siteName: string } };

export type UpdatedHazardMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateBoltResultInput: UpdateBoltResultInput;
}>;


export type UpdatedHazardMutation = { __typename?: 'Mutation', updateBoltResult: { __typename?: 'BoltResult', isHazard: boolean, hazardCompletedDate?: Array<any> | null } };

export type GetAllCompaniesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllCompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyListResponse', totalRecords: number, results: Array<{ __typename?: 'Company', id: string, name: string }> } };

export type CreateCoffeeMutationVariables = Exact<{
  createCoffeeInput: CreateCoffeeInput;
}>;


export type CreateCoffeeMutation = { __typename?: 'Mutation', createCoffee: { __typename?: 'Coffee', id: string, name: string, brand: string, flavors?: Array<{ __typename?: 'Flavor', id: string, name: string }> | null } };

export type GetMeCoffeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeCoffeesQuery = { __typename?: 'Query', coffees: Array<{ __typename?: 'Coffee', id: string, name: string, brand: string }> };


export const GetBoltResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoltResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"result"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boltResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"siteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"levelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"driveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"result"},"value":{"kind":"Variable","name":{"kind":"Name","value":"result"}}},{"kind":"Argument","name":{"kind":"Name","value":"isHazard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}}},{"kind":"Argument","name":{"kind":"Name","value":"withImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"withComment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"failedCount"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCount"}},{"kind":"Field","name":{"kind":"Name","value":"passedCount"}},{"kind":"Field","name":{"kind":"Name","value":"averageTons"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"measuredAt"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}},{"kind":"Field","name":{"kind":"Name","value":"abortReason"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBoltResultQuery, GetBoltResultQueryVariables>;
export const GetAllBoltResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBoltResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"result"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boltResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"siteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"levelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"driveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"result"},"value":{"kind":"Variable","name":{"kind":"Name","value":"result"}}},{"kind":"Argument","name":{"kind":"Name","value":"isHazard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}}},{"kind":"Argument","name":{"kind":"Name","value":"withImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"withComment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"measuredAt"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"abortReason"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllBoltResultsQuery, GetAllBoltResultsQueryVariables>;
export const GetCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanyQuery, GetCompanyQueryVariables>;
export const GetHazardsIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHazardsId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hazards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}}]}}]}}]} as unknown as DocumentNode<GetHazardsIdQuery, GetHazardsIdQueryVariables>;
export const GetCompanyNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCompanyNameQuery, GetCompanyNameQueryVariables>;
export const GetHazardDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHazardDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hazards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortReason"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"measuredAt"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetHazardDetailsQuery, GetHazardDetailsQueryVariables>;
export const GetLevelDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLevelDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}}]}}]}}]} as unknown as DocumentNode<GetLevelDetailsQuery, GetLevelDetailsQueryVariables>;
export const GetDriveDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDriveDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}}]}}]} as unknown as DocumentNode<GetDriveDetailsQuery, GetDriveDetailsQueryVariables>;
export const GetLocationDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLocationDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]} as unknown as DocumentNode<GetLocationDetailsQuery, GetLocationDetailsQueryVariables>;
export const GetNameDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNameDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<GetNameDetailsQuery, GetNameDetailsQueryVariables>;
export const GetSiteNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSiteName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}}]}}]} as unknown as DocumentNode<GetSiteNameQuery, GetSiteNameQueryVariables>;
export const UpdatedHazardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatedHazard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateBoltResultInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBoltResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoltResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateBoltResultInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateBoltResultInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}}]}}]}}]} as unknown as DocumentNode<UpdatedHazardMutation, UpdatedHazardMutationVariables>;
export const GetAllCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCompanies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const CreateCoffeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCoffee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCoffeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoffee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCoffeeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"flavors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCoffeeMutation, CreateCoffeeMutationVariables>;
export const GetMeCoffeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeCoffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}}]}}]}}]} as unknown as DocumentNode<GetMeCoffeesQuery, GetMeCoffeesQueryVariables>;