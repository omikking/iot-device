/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n": types.UpdateCompanyDocument,
    "\n  mutation CreateSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.CreateSiteDocument,
    "\n  mutation UpdateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.UpdateSiteDocument,
    "\n  mutation removeDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n      driveName\n      levelId\n    }\n  }\n": types.RemoveDriveDocument,
    "\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n": types.CreateDriveDocument,
    "\n  mutation removeLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n": types.RemoveLevelDocument,
    "\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n": types.CreateLevelDocument,
    "\n  mutation removeLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n      locationName\n      driveId\n    }\n  }\n": types.RemoveLocationDocument,
    "\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n": types.CreateLocationDocument,
    "\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n": types.CreateCoffeeDocument,
    "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n": types.GetMeCoffeesDocument,
    "\n  query getMeCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n": types.GetMeCompanyDocument,
    "\n  query getMeCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n": types.GetMeCompaniesDocument,
    "\n  query getCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n": types.GetCompaniesDocument,
    "\n  query GetCompanyName($id: String!) {\n    company(id: $id) {\n      name\n    }\n  }\n": types.GetCompanyNameDocument,
    "\n  query getCompanySites {\n    sites {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.GetCompanySitesDocument,
    "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.DeleteSiteDocument,
    "\n  query getSites {\n    sites {\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.GetSitesDocument,

    "\n  mutation RemoveUser($id: String!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n": types.RemoveUserDocument,
    "\n  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n      isGlobalVisibility\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n    }\n  }\n": types.UpdateDriveDocument,
    "\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n    }\n  }\n": types.UpdateLevelDocument,
    "\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n    }\n  }\n": types.UpdateLocationDocument,
    "\n  query getMeSitesLocations {\n    sites {\n      id\n      createdAt\n      updatedAt\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GetMeSitesLocationsDocument,
    "\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GetMeSiteLocationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n      driveName\n      levelId\n    }\n  }\n"): (typeof documents)["\n  mutation removeDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n      driveName\n      levelId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"): (typeof documents)["\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n"): (typeof documents)["\n  mutation removeLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"): (typeof documents)["\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n      locationName\n      driveId\n    }\n  }\n"): (typeof documents)["\n  mutation removeLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n      locationName\n      driveId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"): (typeof documents)["\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"): (typeof documents)["\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMeCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n"): (typeof documents)["\n  query getMeCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n"): (typeof documents)["\n  query getCompanies {\n    companies {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCompanyName($id: String!) {\n    company(id: $id) {\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCompanyName($id: String!) {\n    company(id: $id) {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanySites {\n    sites {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  query getCompanySites {\n    sites {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getSites {\n    sites {\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  query getSites {\n    sites {\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */

export function graphql(source: "\n  mutation RemoveUser($id: String!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveUser($id: String!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n      isGlobalVisibility\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n      isGlobalVisibility\n    }\n  }\n"];

export function graphql(source: "\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n    }\n  }\n"): (typeof documents)["\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n    }\n  }\n"): (typeof documents)["\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n    }\n  }\n"): (typeof documents)["\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeSitesLocations {\n    sites {\n      id\n      createdAt\n      updatedAt\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMeSitesLocations {\n    sites {\n      id\n      createdAt\n      updatedAt\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;