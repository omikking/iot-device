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
    "\n  query getHazardId($id: String!) {\n    hazards(companyId: $id) {\n      id\n    }\n  }\n": types.GetHazardIdDocument,
    "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetCompanyNameDocument,
    "\n  query getHazardDetails($id: String!) {\n    hazards(companyId: $id) {\n      abortReason\n      boltNumber\n      boltType\n      comment\n      createdAt\n      driveId\n      hazardCompletedDate\n      id\n      image\n      isHazard\n      levelId\n      locationId\n      peakDisplacement\n      peakLoad\n      positionInRing\n      result\n      siteId\n      updatedAt\n      userId\n    }\n  }\n": types.GetHazardDetailsDocument,
    "\n  query getLevelDetails($id: String!) {\n    level(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n": types.GetLevelDetailsDocument,
    "\n  query getDriveDetails($id: String!) {\n    drive(id: $id) {\n      id\n      driveName\n    }\n  }\n": types.GetDriveDetailsDocument,
    "\n  query getLocationDetails($id: String!) {\n    location(id: $id) {\n      id\n      locationName\n    }\n  }\n": types.GetLocationDetailsDocument,
    "\n  query getNameDetails($id: String!) {\n    user(id: $id) {\n      fullName\n    }\n  }\n": types.GetNameDetailsDocument,
    "\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      siteName\n    }\n  }\n": types.GetMeSiteLocationDocument,
    "\n  mutation createCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n": types.CreateCoffeeDocument,
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
export function graphql(source: "\n  query getHazardId($id: String!) {\n    hazards(companyId: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query getHazardId($id: String!) {\n    hazards(companyId: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getHazardDetails($id: String!) {\n    hazards(companyId: $id) {\n      abortReason\n      boltNumber\n      boltType\n      comment\n      createdAt\n      driveId\n      hazardCompletedDate\n      id\n      image\n      isHazard\n      levelId\n      locationId\n      peakDisplacement\n      peakLoad\n      positionInRing\n      result\n      siteId\n      updatedAt\n      userId\n    }\n  }\n"): (typeof documents)["\n  query getHazardDetails($id: String!) {\n    hazards(companyId: $id) {\n      abortReason\n      boltNumber\n      boltType\n      comment\n      createdAt\n      driveId\n      hazardCompletedDate\n      id\n      image\n      isHazard\n      levelId\n      locationId\n      peakDisplacement\n      peakLoad\n      positionInRing\n      result\n      siteId\n      updatedAt\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getLevelDetails($id: String!) {\n    level(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n"): (typeof documents)["\n  query getLevelDetails($id: String!) {\n    level(id: $id) {\n      id\n      levelName\n      siteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getDriveDetails($id: String!) {\n    drive(id: $id) {\n      id\n      driveName\n    }\n  }\n"): (typeof documents)["\n  query getDriveDetails($id: String!) {\n    drive(id: $id) {\n      id\n      driveName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getLocationDetails($id: String!) {\n    location(id: $id) {\n      id\n      locationName\n    }\n  }\n"): (typeof documents)["\n  query getLocationDetails($id: String!) {\n    location(id: $id) {\n      id\n      locationName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getNameDetails($id: String!) {\n    user(id: $id) {\n      fullName\n    }\n  }\n"): (typeof documents)["\n  query getNameDetails($id: String!) {\n    user(id: $id) {\n      fullName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      siteName\n    }\n  }\n"): (typeof documents)["\n  query getMeSiteLocation($id: String!) {\n    site(id: $id) {\n      siteName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createCoffee($createCoffeeInput: CreateCoffeeInput!) {\n    createCoffee(createCoffeeInput: $createCoffeeInput) {\n      id\n      name\n      brand\n      flavors {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"): (typeof documents)["\n  query getMeCoffees {\n    coffees {\n      id\n      name\n      brand\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;