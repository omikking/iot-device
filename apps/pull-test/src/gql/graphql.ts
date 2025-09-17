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
};

export enum Application {
  Banshee = 'BANSHEE',
  PullTest = 'PULL_TEST',
  PullTestOperator = 'PULL_TEST_OPERATOR'
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
  Md47 = 'MD47',
  Mdx47 = 'MDX47'
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
  image?: InputMaybe<Scalars['String']['input']>;
  isHazard: Scalars['Boolean']['input'];
  levelId: Scalars['String']['input'];
  locationId: Scalars['String']['input'];
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

export type Flavor = {
  __typename?: 'Flavor';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Invitation = {
  __typename?: 'Invitation';
  companyId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  globalRole?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
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
  NotTestedVoidCavity = 'NOT_TESTED_VOID_CAVITY',
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
  getPlanLevel?: Maybe<Array<PlanLevel>>;
  getPullTestAbortReason?: Maybe<Array<PullTestAbortReason>>;
  getResults: Array<Result>;
  getRingPosition?: Maybe<Array<RingPosition>>;
  getRoles: Array<Role>;
  hazards?: Maybe<Array<BoltResult>>;
  level: Level;
  levels: Array<Level>;
  location: Location;
  locations: Array<Location>;
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
  image?: InputMaybe<Scalars['String']['input']>;
  isHazard?: InputMaybe<Scalars['Boolean']['input']>;
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


export type GetBoltResultQuery = { __typename?: 'Query', boltResults: { __typename?: 'BoltResultResponse', totalRecords: number, failedCount: number, hazardCount: number, passedCount: number, averageTons?: number | null, results: Array<{ __typename?: 'BoltResult', id: string, createdAt: any, updatedAt: any, boltNumber: number, boltType: string, peakLoad: Array<number>, peakDisplacement: Array<number>, positionInRing: string, result: string, isHazard: boolean, hazardCompletedDate?: Array<any> | null, abortReason?: string | null, comment?: string | null, image?: string | null, siteId: string, levelId: string, driveId: string, locationId: string, userId: string, site?: { __typename?: 'Site', siteName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null, level?: { __typename?: 'Level', levelName: string } | null }> } };

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


export type GetAllBoltResultsQuery = { __typename?: 'Query', boltResults: { __typename?: 'BoltResultResponse', totalRecords: number, results: Array<{ __typename?: 'BoltResult', id: string, createdAt: any, updatedAt: any, boltNumber: number, boltType: string, peakLoad: Array<number>, peakDisplacement: Array<number>, positionInRing: string, result: string, comment?: string | null, isHazard: boolean, abortReason?: string | null, level?: { __typename?: 'Level', levelName: string } | null, drive?: { __typename?: 'Drive', driveName: string } | null, location?: { __typename?: 'Location', locationName: string } | null }> } };

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


export type GetHazardDetailsQuery = { __typename?: 'Query', hazards?: Array<{ __typename?: 'BoltResult', abortReason?: string | null, boltNumber: number, boltType: string, comment?: string | null, createdAt: any, driveId: string, hazardCompletedDate?: Array<any> | null, id: string, image?: string | null, isHazard: boolean, levelId: string, locationId: string, peakDisplacement: Array<number>, peakLoad: Array<number>, positionInRing: string, result: string, siteId: string, updatedAt: any, userId: string }> | null };

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


export const GetBoltResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoltResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"result"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boltResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"siteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"levelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"driveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"result"},"value":{"kind":"Variable","name":{"kind":"Name","value":"result"}}},{"kind":"Argument","name":{"kind":"Name","value":"isHazard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}}},{"kind":"Argument","name":{"kind":"Name","value":"withImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"withComment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"failedCount"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCount"}},{"kind":"Field","name":{"kind":"Name","value":"passedCount"}},{"kind":"Field","name":{"kind":"Name","value":"averageTons"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}},{"kind":"Field","name":{"kind":"Name","value":"abortReason"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBoltResultQuery, GetBoltResultQueryVariables>;
export const GetAllBoltResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBoltResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"result"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boltResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"siteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"levelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"levelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"driveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"driveId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"result"},"value":{"kind":"Variable","name":{"kind":"Name","value":"result"}}},{"kind":"Argument","name":{"kind":"Name","value":"isHazard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isHazard"}}},{"kind":"Argument","name":{"kind":"Name","value":"withImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"withComment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withComment"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"abortReason"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllBoltResultsQuery, GetAllBoltResultsQueryVariables>;
export const GetCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"drives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"driveName"}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCompanyQuery, GetCompanyQueryVariables>;
export const GetHazardsIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHazardsId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hazards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}}]}}]}}]} as unknown as DocumentNode<GetHazardsIdQuery, GetHazardsIdQueryVariables>;
export const GetCompanyNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCompanyNameQuery, GetCompanyNameQueryVariables>;
export const GetHazardDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHazardDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hazards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortReason"}},{"kind":"Field","name":{"kind":"Name","value":"boltNumber"}},{"kind":"Field","name":{"kind":"Name","value":"boltType"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"driveId"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"levelId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}},{"kind":"Field","name":{"kind":"Name","value":"peakDisplacement"}},{"kind":"Field","name":{"kind":"Name","value":"peakLoad"}},{"kind":"Field","name":{"kind":"Name","value":"positionInRing"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetHazardDetailsQuery, GetHazardDetailsQueryVariables>;
export const GetLevelDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLevelDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"levelName"}},{"kind":"Field","name":{"kind":"Name","value":"siteId"}}]}}]}}]} as unknown as DocumentNode<GetLevelDetailsQuery, GetLevelDetailsQueryVariables>;
export const GetDriveDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDriveDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"drive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driveName"}}]}}]}}]} as unknown as DocumentNode<GetDriveDetailsQuery, GetDriveDetailsQueryVariables>;
export const GetLocationDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLocationDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]} as unknown as DocumentNode<GetLocationDetailsQuery, GetLocationDetailsQueryVariables>;
export const GetNameDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNameDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<GetNameDetailsQuery, GetNameDetailsQueryVariables>;
export const GetSiteNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSiteName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteName"}}]}}]}}]} as unknown as DocumentNode<GetSiteNameQuery, GetSiteNameQueryVariables>;
export const UpdatedHazardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatedHazard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateBoltResultInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBoltResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoltResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateBoltResultInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateBoltResultInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isHazard"}},{"kind":"Field","name":{"kind":"Name","value":"hazardCompletedDate"}}]}}]}}]} as unknown as DocumentNode<UpdatedHazardMutation, UpdatedHazardMutationVariables>;
export const GetAllCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCompanies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const CreateCoffeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCoffee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCoffeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoffee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCoffeeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"flavors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCoffeeMutation, CreateCoffeeMutationVariables>;
export const GetMeCoffeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeCoffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}}]}}]}}]} as unknown as DocumentNode<GetMeCoffeesQuery, GetMeCoffeesQueryVariables>;