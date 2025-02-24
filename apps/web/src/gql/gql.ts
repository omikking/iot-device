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
    "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   userId\n      # }\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   newUserId\n      #   oldUserId\n      # }\n    }\n  }\n": types.UpdateCompanyDocument,
    "\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n": types.GetCompaniesDocument,
    "\n  mutation CreateCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n": types.CreateCoffeeDocument,
    "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n": types.GetMeCoffeesDocument,
    "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.GetCompanyDocument,
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
export function graphql(source: "\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   userId\n      # }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   userId\n      # }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   newUserId\n      #   oldUserId\n      # }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      # userPermissions {\n      #   newUserId\n      #   oldUserId\n      # }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCompanies {\n    companies {\n      id\n      name\n    }\n  }\n"];
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
export function graphql(source: "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;