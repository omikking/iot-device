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
  driveId: Scalars['String']['output'];
  hazardCompletedDate?: Maybe<Array<Scalars['DateTime']['output']>>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isHazard: Scalars['Boolean']['output'];
  levelId: Scalars['String']['output'];
  locationId: Scalars['String']['output'];
  peakDisplacement: Array<Scalars['Int']['output']>;
  peakLoad: Array<Scalars['Int']['output']>;
  positionInRing: Scalars['String']['output'];
  result: Scalars['String']['output'];
  siteId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

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
  plans?: Maybe<Array<Plan>>;
  postalCode: Scalars['String']['output'];
  sites?: Maybe<Array<Site>>;
  updatedAt: Scalars['DateTime']['output'];
  users?: Maybe<Array<User>>;
};

/**
 * CreateAdminPermissionInput
 * Define the input fields to create a new userPermission
 */
export type CreateAdminPermissionInput = {
  userId: Scalars['String']['input'];
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
  userPermissions: Array<CreateAdminPermissionInput>;
};

/**
 * CreateDriveInput
 * Define the input fields to create a new drive
 */
export type CreateDriveInput = {
  driveName: Scalars['String']['input'];
  levelId: Scalars['String']['input'];
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
  userId: Scalars['String']['input'];
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
  createBoltResult: BoltResult;
  createCoffee: Coffee;
  createCompany: Company;
  createDrive: Drive;
  createLevel: Level;
  createLocation: Location;
  createSite: Site;
  createUserPermission: UserPermission;
  removeBoltResult: BoltResult;
  removeCoffee: Coffee;
  removeCompany: Company;
  removeDrive: Drive;
  removeLevel: Level;
  removeLocation: Location;
  removeSite: Site;
  removeUser: User;
  removeUserPermission: UserPermission;
  updateBoltResult: BoltResult;
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
export type MutationCreateBoltResultArgs = {
  createBoltResultInput: CreateBoltResultInput;
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
export type MutationUpdateBoltResultArgs = {
  id: Scalars['String']['input'];
  updateBoltResultInput: UpdateBoltResultInput;
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

/**
 * Query
 * Define the queries that can be made to the User model
 */
export type Query = {
  __typename?: 'Query';
  boltResult: BoltResult;
  boltResults: Array<BoltResult>;
  coffee: Coffee;
  coffees: Array<Coffee>;
  companies: Array<Company>;
  company: Company;
  drive: Dri  hazards?: Maybe<Array<BoltResult>>;
  level: Level;
  levels: Array<Level>;
  location: Location;
  locations: Array<Location>;
  site: Site;
  sites: Array<Site>;
  user: User;
  userPermission: UserPermission;
  userPermissions: Array<UserPermission>;
  users: Array<User>;
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
export type QueryCoffeeArgs = {
  id: Scalars['ID']['input'];
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
 * UpdateAdminPermissionInput
 * Define the input fields to update the sandvik admin to new admin
 */
export type UpdateAdminPermissionInput = {
  newUserId: Scalars['String']['input'];
  oldUserId: Scalars['String']['input'];
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
  userPermissions?: InputMaybe<Array<UpdateAdminPermissionInput>>;
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

/**
 * UpdatePlanInput
 * Define the input fields to update the plans
 */
export type UpdatePlanInput = {
  applicationName: Scalars['String']['input'];
  expiringDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['String']['input'];
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

export type CreateCoffeeMutationVariables = Exact<{
  createCoffeeInput: CreateCoffeeInput;
}>;


export type CreateCoffeeMutation = { __typename?: 'Mutation', createCoffee: { __typename?: 'Coffee', id: string, name: string, brand: string, flavors?: Array<{ __typename?: 'Flavor', id: string, name: string }> | null } };

export type GetMeCoffeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeCoffeesQuery = { __typename?: 'Query', coffees: Array<{ __typename?: 'Coffee', id: string, name: string, brand: string }> };

export type GetCompanyDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCompanyDetailsQuery = { __typename?: 'Query', company: { __typename?: 'Company', id: string, name: string } };


export const CreateCoffeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCoffee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCoffeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoffee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCoffeeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createCoffeeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"flavors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCoffeeMutation, CreateCoffeeMutationVariables>;
export const GetMeCoffeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeCoffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coffees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}}]}}]}}]} as unknown as DocumentNode<GetMeCoffeesQuery, GetMeCoffeesQueryVariables>;
export const GetCompanyDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCompanyDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCompanyDetailsQuery, GetCompanyDetailsQueryVariables>;