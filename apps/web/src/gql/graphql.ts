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
  Upload: { input: any; output: any; }
};

export enum Application {
  PullTest = 'PULL_TEST',
  PullTestTechnician = 'PULL_TEST_TECHNICIAN'
}

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

/**
 * Mutation
 * Define the mutations that can be made to the User model
 */
export type Mutation = {
  __typename?: 'Mutation';
  completeInvitation: User;
  confirmPasswordReset: Scalars['Boolean']['output'];
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
  updateBoltResult: BoltResult;
  updateBoltResults: Array<BoltResult>;
  updateCoffee: Coffee;
  updateCompany: Company;
  updateDrive: Drive;
  updateLevel: Level;
  updateLocation: Location;
  updateSite: Site;
  updateUser: User;
  updateUserPermission: UserPermission;
  validateResetToken: Scalars['Boolean']['output'];
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
export type MutationConfirmPasswordResetArgs = {
  input: ConfirmPasswordResetInput;
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
  boltResult: BoltResult;
  boltResults: BoltResultResponse;
  coffee: Coffee;
  coffees: Array<Coffee>;
  companies: CompanyListResponse;
  company: Company;
  drive: Drive;
  drives: Array<Drive>;
  getApplication?: Maybe<Array<Application>>;
  getBoltTypes?: Maybe<Array<BoltType>>;
  getBoltTypesOptions: Array<EnumOption>;
  getPlanLevel?: Maybe<Array<PlanLevel>>;
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
  pendingGlobalInvitations: Array<Invitation>;
  pendingInvitations: Array<Invitation>;
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
export type QueryPendingInvitationsArgs = {
  companyId: Scalars['String']['input'];
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

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, fullName: string, workPlace: string, phoneNumber?: string | null } };

export type GetPendingGlobalInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingGlobalInvitationsQuery = { __typename?: 'Query', pendingGlobalInvitations: Array<{ __typename?: 'Invitation', id: string, email: string, globalRole?: string | null, createdAt: any, used: boolean, isGlobalVisibility?: boolean | null }> };

export type GetAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminsQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, createdAt: any, email: string, fullName: string, workPlace: string, phoneNumber?: string | null, globalRole?: string | null }> };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string, orgNumber: string, address: string, postalCode: string, city: string, country: string, companyContactEmail: string, sandvikAdminUserId?: string | null, plans?: Array<{ __typename?: 'Plan', id: string, companyId: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null, users?: Array<{ __typename?: 'User', id: string, fullName: string, phoneNumber?: string | null, email: string }> | null } };

export type RemoveCompanyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveCompanyMutation = { __typename?: 'Mutation', removeCompany: { __typename?: 'Company', id: string } };

export type GetCompanyPlansQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyPlansQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string, plans?: Array<{ __typename?: 'Plan', id: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null } };

export type GetAllCompaniesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllCompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyListResponse', totalRecords: number, results: Array<{ __typename?: 'Company', id: string, name: string }> } };

export type ValidateInvitationQueryVariables = Exact<{
  id: Scalars['String']['input'];
  token: Scalars['String']['input'];
}>;


export type ValidateInvitationQuery = { __typename?: 'Query', validateInvitation: { __typename?: 'InvitationValidation', valid: boolean, reason?: string | null, invitation?: { __typename?: 'Invitation', id: string, email: string, companyId?: string | null, companyName?: string | null, globalRole?: string | null, role?: string | null, expiresAt: any, used: boolean } | null } };

export type CompleteInvitationMutationVariables = Exact<{
  input: CompleteInvitationInput;
}>;


export type CompleteInvitationMutation = { __typename?: 'Mutation', completeInvitation: { __typename?: 'User', id: string, email: string, fullName: string, globalRole?: string | null } };

export type GetCompanySitesNamesQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanySitesNamesQuery = { __typename?: 'Query', company: { __typename?: 'Company', name: string, sites?: Array<{ __typename?: 'Site', id: string, siteName: string }> | null } };

export type GetFullSiteLocationsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetFullSiteLocationsQuery = { __typename?: 'Query', site: { __typename?: 'Site', id: string, siteName: string, levels?: Array<{ __typename?: 'Level', id: string, levelName: string, siteId: string, drives?: Array<{ __typename?: 'Drive', id: string, driveName: string, levelId: string, locations?: Array<{ __typename?: 'Location', id: string, driveId: string, locationName: string }> | null }> | null }> | null } };

export type GetCompanyNameQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyNameQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string } };

export type GetCompanySitesQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanySitesQuery = { __typename?: 'Query', company: { __typename?: 'Company', sites?: Array<{ __typename?: 'Site', id: string, siteName: string, address: string, city: string, country: string, postalCode: string, companyId: string }> | null } };

export type GetTechniciansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTechniciansQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, workPlace: string, isGlobalVisibility?: boolean | null, phoneNumber?: string | null, globalRole?: string | null, createdAt: any }> };

export type GetPendingInvitationsQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetPendingInvitationsQuery = { __typename?: 'Query', pendingInvitations: Array<{ __typename?: 'Invitation', id: string, email: string, role?: string | null, expiresAt: any, createdAt: any, used: boolean }> };

export type GetCompanyUsersQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyUsersQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, users?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, workPlace: string, phoneNumber?: string | null, globalRole?: string | null, userPermissions?: Array<{ __typename?: 'UserPermission', id: string, userId: string, createdAt: any, companyId: string, role: string, appsAccess: Array<string> }> | null }> | null, plans?: Array<{ __typename?: 'Plan', id: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null } };

export type RequestPasswordResetMutationVariables = Exact<{
  input: RequestPasswordResetInput;
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: boolean };

export type ValidateResetTokenMutationVariables = Exact<{
  input: ValidateResetTokenInput;
}>;


export type ValidateResetTokenMutation = { __typename?: 'Mutation', validateResetToken: boolean };

export type ConfirmPasswordResetMutationVariables = Exact<{
  input: ConfirmPasswordResetInput;
}>;


export type ConfirmPasswordResetMutation = { __typename?: 'Mutation', confirmPasswordReset: boolean };

export type UpdateAccountUserMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateUserInput: UpdateUserInput;
  updatePasswordInput?: InputMaybe<UpdatePasswordInput>;
}>;


export type UpdateAccountUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, fullName: string, workPlace: string, phoneNumber?: string | null } };

export type CreateGlobalInvitationMutationVariables = Exact<{
  input: CreateGlobalInvitationInput;
}>;


export type CreateGlobalInvitationMutation = { __typename?: 'Mutation', createGlobalInvitation: { __typename?: 'InvitationResponse', invitationId?: string | null, isNewUser: boolean } };

export type CreateSiteMutationVariables = Exact<{
  createSiteInput: CreateSiteInput;
}>;


export type CreateSiteMutation = { __typename?: 'Mutation', createSite: { __typename?: 'Site', id: string, siteName: string, address: string, postalCode: string, city: string, country: string, companyId: string } };

export type UpdateSiteMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateSiteInput: UpdateSiteInput;
}>;


export type UpdateSiteMutation = { __typename?: 'Mutation', updateSite: { __typename?: 'Site', id: string, siteName: string, address: string, postalCode: string, city: string, country: string, companyId: string } };

export type UpdateTechnicianMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateUserInput: UpdateUserInput;
}>;


export type UpdateTechnicianMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, isGlobalVisibility?: boolean | null } };

export type CreateInvitationMutationVariables = Exact<{
  input: CreateInvitationInput;
}>;


export type CreateInvitationMutation = { __typename?: 'Mutation', createInvitation: { __typename?: 'InvitationResponse', invitationId?: string | null, isNewUser: boolean } };

export type GetTechniciansByRoleQueryVariables = Exact<{
  roles: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type GetTechniciansByRoleQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string, email: string, workPlace: string }> };

export type UpdateUserPermissionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateUserPermissionInput: UpdateUserPermissionInput;
}>;


export type UpdateUserPermissionMutation = { __typename?: 'Mutation', updateUserPermission: { __typename?: 'UserPermission', id: string, userId: string, role: string, appsAccess: Array<string>, companyId: string } };

export type GetUsersQueryVariables = Exact<{
  roles: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, fullName: string }> };

export type DeleteAdminMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAdminMutation = { __typename?: 'Mutation', removeUser: { __typename?: 'User', id: string, email: string, fullName: string, workPlace: string, phoneNumber?: string | null, globalRole?: string | null } };

export type ResendInvitationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ResendInvitationMutation = { __typename?: 'Mutation', resendInvitation: { __typename?: 'Invitation', id: string, email: string, expiresAt: any } };

export type DeleteInvitationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteInvitationMutation = { __typename?: 'Mutation', removeInvitation: { __typename?: 'Invitation', id: string, email: string } };

export type CreateCompanyMutationVariables = Exact<{
  createCompanyInput: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany: { __typename?: 'Company', id: string, name: string, orgNumber: string, address: string, postalCode: string, city: string, country: string, companyContactEmail: string, plans?: Array<{ __typename?: 'Plan', id: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null, users?: Array<{ __typename?: 'User', id: string, fullName: string }> | null } };

export type UpdateCompanyMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateCompanyInput: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany: { __typename?: 'Company', id: string, name: string, orgNumber: string, address: string, postalCode: string, city: string, country: string, companyContactEmail: string, plans?: Array<{ __typename?: 'Plan', id: string, applicationName: string, planLevel: string, expiringDate?: any | null }> | null, users?: Array<{ __typename?: 'User', id: string, fullName: string }> | null } };

export type GetCompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyListResponse', results: Array<{ __typename?: 'Company', id: string, name: string }> } };

export type CreateDriveMutationVariables = Exact<{
  createDriveInput: CreateDriveInput;
}>;


export type CreateDriveMutation = { __typename?: 'Mutation', createDrive: { __typename?: 'Drive', id: string, driveName: string, levelId: string } };

export type UpdateDriveMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateDriveInput: UpdateDriveInput;
}>;


export type UpdateDriveMutation = { __typename?: 'Mutation', updateDrive: { __typename?: 'Drive', id: string, driveName: string, levelId: string } };

export type DeleteDriveMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteDriveMutation = { __typename?: 'Mutation', removeDrive: { __typename?: 'Drive', id: string } };

export type CreateLevelMutationVariables = Exact<{
  createLevelInput: CreateLevelInput;
}>;


export type CreateLevelMutation = { __typename?: 'Mutation', createLevel: { __typename?: 'Level', id: string, levelName: string, siteId: string } };

export type UpdateLevelMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateLevelInput: UpdateLevelInput;
}>;


export type UpdateLevelMutation = { __typename?: 'Mutation', updateLevel: { __typename?: 'Level', id: string, levelName: string, siteId: string } };

export type DeleteLevelMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLevelMutation = { __typename?: 'Mutation', removeLevel: { __typename?: 'Level', id: string } };

export type CreateLocationMutationVariables = Exact<{
  createLocationInput: CreateLocationInput;
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation: { __typename?: 'Location', id: string, locationName: string, driveId: string } };

export type UpdateLocationMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateLocationInput: UpdateLocationInput;
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'Location', id: string, locationName: string, driveId: string } };

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLocationMutation = { __typename?: 'Mutation', removeLocation: { __typename?: 'Location', id: string } };

export type DeleteSiteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteSiteMutation = { __typename?: 'Mutation', removeSite: { __typename?: 'Site', id: string, siteName: string, address: string, city: string, country: string, postalCode: string, companyId: string } };

export type DeleteUserPermissionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteUserPermissionMutation = { __typename?: 'Mutation', removeUserPermission: { __typename?: 'UserPermission', id: string } };

export type CreateCoffeeMutationVariables = Exact<{
  createCoffeeInput: CreateCoffeeInput;
}>;


export type CreateCoffeeMutation = { __typename?: 'Mutation', createCoffee: { __typename?: 'Coffee', id: string, name: string, brand: string, flavors?: Array<{ __typename?: 'Flavor', id: string, name: string }> | null } };

export type GetMeCoffeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeCoffeesQuery = { __typename?: 'Query', coffees: Array<{ __typename?: 'Coffee', id: string, name: string, brand: string }> };


export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetPendingGlobalInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPendingGlobalInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pendingGlobalInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"used"}},{"kind":"Field","name":{"kind":"Name","value":"isGlobalVisibility"}}]}}]}}]} as unknown as DocumentNode<GetPendingGlobalInvitationsQuery, GetPendingGlobalInvitationsQueryVariables>;
export const GetAdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAdmins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"StringValue","value":"SANDVIK_ADMIN","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]}}]} as unknown as DocumentNode<GetAdminsQuery, GetAdminsQueryVariables>;
export const GetCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"orgNumber"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"companyContactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"sandvikAdminUserId"}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanyQuery, GetCompanyQueryVariables>;
export const RemoveCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveCompanyMutation, RemoveCompanyMutationVariables>;
export const GetCompanyPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyPlans"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanyPlansQuery, GetCompanyPlansQueryVariables>;
export const GetAllCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCompanies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const ValidateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"validateInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valid"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"invitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"used"}}]}}]}}]}}]} as unknown as DocumentNode<ValidateInvitationQuery, ValidateInvitationQueryVariables>;
export const CompleteInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]}}]} as unknown as DocumentNode<CompleteInvitationMutation, CompleteInvitationMutationVariables>;
export const GetCompanySitesNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanySitesNames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanySitesNamesQuery, GetCompanySitesNamesQueryVariables>;
export const GetFullSiteLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFullSiteLocations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFullSiteLocationsQuery, GetFullSiteLocationsQueryVariables>;
export const GetCompanyNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCompanyNameQuery, GetCompanyNameQueryVariables>;
export const GetCompanySitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanySites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanySitesQuery, GetCompanySitesQueryVariables>;
export const GetTechniciansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTechnicians"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"StringValue","value":"SANDVIK_TECHNICIAN","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"isGlobalVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetTechniciansQuery, GetTechniciansQueryVariables>;
export const GetPendingInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPendingInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pendingInvitations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"used"}}]}}]}}]} as unknown as DocumentNode<GetPendingInvitationsQuery, GetPendingInvitationsQueryVariables>;
export const GetCompanyUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"userPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"appsAccess"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanyUsersQuery, GetCompanyUsersQueryVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestPasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ValidateResetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"validateResetToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ValidateResetTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateResetToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ValidateResetTokenMutation, ValidateResetTokenMutationVariables>;
export const ConfirmPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"confirmPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmPasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ConfirmPasswordResetMutation, ConfirmPasswordResetMutationVariables>;
export const UpdateAccountUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAccountUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatePasswordInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePasswordInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"updatePasswordInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatePasswordInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<UpdateAccountUserMutation, UpdateAccountUserMutationVariables>;
export const CreateGlobalInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGlobalInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGlobalInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGlobalInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"isNewUser"}}]}}]}}]} as unknown as DocumentNode<CreateGlobalInvitationMutation, CreateGlobalInvitationMutationVariables>;
export const CreateSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createSiteInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createSiteInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createSiteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<CreateSiteMutation, CreateSiteMutationVariables>;
export const UpdateSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSiteInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateSiteInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSiteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<UpdateSiteMutation, UpdateSiteMutationVariables>;
export const UpdateTechnicianDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTechnician"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isGlobalVisibility"}}]}}]}}]} as unknown as DocumentNode<UpdateTechnicianMutation, UpdateTechnicianMutationVariables>;
export const CreateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitationId"}},{"kind":"Field","name":{"kind":"Name","value":"isNewUser"}}]}}]}}]} as unknown as DocumentNode<CreateInvitationMutation, CreateInvitationMutationVariables>;
export const GetTechniciansByRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTechniciansByRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}}]}}]}}]} as unknown as DocumentNode<GetTechniciansByRoleQuery, GetTechniciansByRoleQueryVariables>;
export const UpdateUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserPermissionInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateUserPermissionInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserPermissionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"appsAccess"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<UpdateUserPermissionMutation, UpdateUserPermissionMutationVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const DeleteAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"workPlace"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]}}]} as unknown as DocumentNode<DeleteAdminMutation, DeleteAdminMutationVariables>;
export const ResendInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resendInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<ResendInvitationMutation, ResendInvitationMutationVariables>;
export const DeleteInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DeleteInvitationMutation, DeleteInvitationMutationVariables>;
export const CreateCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCompanyInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCompanyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCompanyInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCompanyInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"orgNumber"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"companyContactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const UpdateCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateCompanyInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCompanyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateCompanyInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateCompanyInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"orgNumber"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"companyContactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"plans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicationName"}},{"kind":"Field","name":{"kind":"Name","value":"planLevel"}},{"kind":"Field","name":{"kind":"Name","value":"expiringDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export const GetCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCompaniesQuery, GetCompaniesQueryVariables>;
export const CreateDriveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDrive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createDriveInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDriveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDrive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createDriveInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createDriveInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}}]}}]}}]} as unknown as DocumentNode<CreateDriveMutation, CreateDriveMutationVariables>;
export const UpdateDriveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDrive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateDriveInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDriveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDrive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateDriveInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateDriveInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}}]}}]}}]} as unknown as DocumentNode<UpdateDriveMutation, UpdateDriveMutationVariables>;
export const DeleteDriveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteDrive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDrive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteDriveMutation, DeleteDriveMutationVariables>;
export const CreateLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createLevelInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLevelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createLevelInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createLevelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}}]}}]}}]} as unknown as DocumentNode<CreateLevelMutation, CreateLevelMutationVariables>;
export const UpdateLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateLevelInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLevelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateLevelInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateLevelInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}}]}}]}}]} as unknown as DocumentNode<UpdateLevelMutation, UpdateLevelMutationVariables>;
export const DeleteLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteLevelMutation, DeleteLevelMutationVariables>;
export const CreateLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createLocationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createLocationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createLocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}}]}}]}}]} as unknown as DocumentNode<CreateLocationMutation, CreateLocationMutationVariables>;
export const UpdateLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateLocationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateLocationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateLocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}}]}}]}}]} as unknown as DocumentNode<UpdateLocationMutation, UpdateLocationMutationVariables>;
export const DeleteLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteLocationMutation, DeleteLocationMutationVariables>;
export const DeleteSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<DeleteSiteMutation, DeleteSiteMutationVariables>;
export const DeleteUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserPermissionMutation, DeleteUserPermissionMutationVariables>;
export const CreateCoffeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCoffee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCoffeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoffee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCoffeeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"flavors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCoffeeMutation, CreateCoffeeMutationVariables>;
export const GetMeCoffeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeCoffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}}]}}]}}]} as unknown as DocumentNode<GetMeCoffeesQuery, GetMeCoffeesQueryVariables>;