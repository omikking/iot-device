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
    "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.GetCompanyDocument,
    "\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n": types.GetCompanySitesNamesDocument,
    "\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GetFullSiteLocationsDocument,
    "\n  mutation CreateSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.CreateSiteDocument,
    "\n  mutation UpdateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.UpdateSiteDocument,
    "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.UpdateCompanyDocument,
    "\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n": types.GetCompaniesDocument,
    "\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n": types.GetCompanySitesDocument,
    "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n": types.DeleteSiteDocument,
    "\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n": types.CreateCoffeeDocument,
    "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n": types.GetMeCoffeesDocument,
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
export function graphql(source: "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"): (typeof documents)["\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;