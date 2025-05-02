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
    "\n  query GetBoltResult(\n    $offset: Int,\n    $limit: Int,\n    $siteId: String,\n    $levelId: String,\n    $driveId: String,\n    $locationId: String,\n    $result: String,\n    $isHazard: Boolean\n  ) {\n    boltResults(\n      offset: $offset,\n      limit: $limit,\n      siteId: $siteId,\n      levelId: $levelId,\n      driveId: $driveId,\n      locationId: $locationId,\n      result: $result,\n      isHazard: $isHazard\n    ) {\n      totalRecords\n      results {\n        id\n        createdAt\n        updatedAt\n        boltNumber\n        boltType\n        peakLoad\n        peakDisplacement\n        positionInRing\n        result\n        isHazard\n        hazardCompletedDate\n        abortReason\n        comment\n        image\n        siteId\n        levelId\n        driveId\n        locationId\n        userId\n        site { siteName}\n\t\t\t  drive {driveName}\n        location {locationName}\n      \tlevel { levelName}\n      }\n    }\n  }\n": types.GetBoltResultDocument,
    "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetCompanyNameDocument,
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
export function graphql(source: "\n  query GetBoltResult(\n    $offset: Int,\n    $limit: Int,\n    $siteId: String,\n    $levelId: String,\n    $driveId: String,\n    $locationId: String,\n    $result: String,\n    $isHazard: Boolean\n  ) {\n    boltResults(\n      offset: $offset,\n      limit: $limit,\n      siteId: $siteId,\n      levelId: $levelId,\n      driveId: $driveId,\n      locationId: $locationId,\n      result: $result,\n      isHazard: $isHazard\n    ) {\n      totalRecords\n      results {\n        id\n        createdAt\n        updatedAt\n        boltNumber\n        boltType\n        peakLoad\n        peakDisplacement\n        positionInRing\n        result\n        isHazard\n        hazardCompletedDate\n        abortReason\n        comment\n        image\n        siteId\n        levelId\n        driveId\n        locationId\n        userId\n        site { siteName}\n\t\t\t  drive {driveName}\n        location {locationName}\n      \tlevel { levelName}\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBoltResult(\n    $offset: Int,\n    $limit: Int,\n    $siteId: String,\n    $levelId: String,\n    $driveId: String,\n    $locationId: String,\n    $result: String,\n    $isHazard: Boolean\n  ) {\n    boltResults(\n      offset: $offset,\n      limit: $limit,\n      siteId: $siteId,\n      levelId: $levelId,\n      driveId: $driveId,\n      locationId: $locationId,\n      result: $result,\n      isHazard: $isHazard\n    ) {\n      totalRecords\n      results {\n        id\n        createdAt\n        updatedAt\n        boltNumber\n        boltType\n        peakLoad\n        peakDisplacement\n        positionInRing\n        result\n        isHazard\n        hazardCompletedDate\n        abortReason\n        comment\n        image\n        siteId\n        levelId\n        driveId\n        locationId\n        userId\n        site { siteName}\n\t\t\t  drive {driveName}\n        location {locationName}\n      \tlevel { levelName}\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"];
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