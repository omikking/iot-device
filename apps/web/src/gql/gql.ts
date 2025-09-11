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
    "\n  query getUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n": types.GetUserDocument,
    "\n  query getPendingGlobalInvitations {\n    pendingGlobalInvitations {\n      id\n      email\n      globalRole\n      expiresAt\n      used\n    }\n  }\n": types.GetPendingGlobalInvitationsDocument,
    "\n  query getAdmins {\n    users(roles: \"SANDVIK_ADMIN\") {\n      id\n      createdAt\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n": types.GetAdminsDocument,
    "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      sandvikAdminUserId\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n        phoneNumber\n        email\n      }\n    }\n  }\n": types.GetCompanyDocument,
    "\n  mutation removeCompany($id: String!) {\n    removeCompany(id: $id) {\n      id\n    }\n  }\n": types.RemoveCompanyDocument,
    "\n  query getCompanyPlans($id: String!) {\n    company(id: $id) {\n      id\n      name\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n": types.GetCompanyPlansDocument,
    "\n  query GetAllCompanies($offset: Int, $limit: Int) {\n    companies(offset: $offset, limit: $limit) {\n      totalRecords\n      results {\n        id\n        name\n      }\n    }\n  }\n": types.GetAllCompaniesDocument,
    "\n  query validateInvitation($id: String!, $token: String!) {\n    validateInvitation(id: $id, token: $token) {\n      valid\n      reason\n      invitation {\n        id\n        email\n        companyId\n        globalRole\n        role\n        expiresAt\n        used\n      }\n    }\n  }\n": types.ValidateInvitationDocument,
    "\n  mutation completeInvitation($input: CompleteInvitationInput!) {\n    completeInvitation(input: $input) {\n      id\n      email\n      fullName\n      globalRole\n    }\n  }\n": types.CompleteInvitationDocument,
    "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n": types.GetCompanyNameDocument,
    "\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      name\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n": types.GetCompanySitesNamesDocument,
    "\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GetFullSiteLocationsDocument,
    "\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n": types.GetCompanySitesDocument,
    "\n  query getTechnicians {\n    users(roles: \"SANDVIK_TECHNICIAN\") {\n      id\n      fullName\n      email\n      workPlace\n      isGlobalVisibility\n      phoneNumber\n      globalRole\n      createdAt\n    }\n  }\n": types.GetTechniciansDocument,
    "\n  query getCompanyUsers($id: String!) {\n    company(id: $id) {\n      id\n      users {\n        id\n        email\n        fullName\n        workPlace\n        phoneNumber\n        globalRole\n        userPermissions {\n          id\n          userId\n          companyId\n          role\n          appsAccess\n        }\n      }\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n": types.GetCompanyUsersDocument,
    "\n  mutation updateAccountUser(\n    $id: String!\n    $updateUserInput: UpdateUserInput!\n    $updatePasswordInput: UpdatePasswordInput\n  ) {\n    updateUser(\n      id: $id\n      updateUserInput: $updateUserInput\n      updatePasswordInput: $updatePasswordInput\n    ) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n": types.UpdateAccountUserDocument,
    "\n  mutation createGlobalInvitation($input: CreateGlobalInvitationInput!) {\n    createGlobalInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n": types.CreateGlobalInvitationDocument,
    "\n  mutation createSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.CreateSiteDocument,
    "\n  mutation updateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n": types.UpdateSiteDocument,
    "\n  mutation updateTechnician($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      isGlobalVisibility\n    }\n  }\n": types.UpdateTechnicianDocument,
    "\n  mutation createInvitation($input: CreateInvitationInput!) {\n    createInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n": types.CreateInvitationDocument,
    "\n  query getTechniciansByRole($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n      email\n      workPlace\n    }\n  }\n": types.GetTechniciansByRoleDocument,
    "\n  mutation updateUserPermission(\n    $id: String!\n    $updateUserPermissionInput: UpdateUserPermissionInput!\n  ) {\n    updateUserPermission(\n      id: $id\n      updateUserPermissionInput: $updateUserPermissionInput\n    ) {\n      id\n      userId\n      role\n      appsAccess\n      companyId\n    }\n  }\n": types.UpdateUserPermissionDocument,
    "\n  query GetUsers($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation deleteAdmin($id: String!) {\n    removeUser(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n": types.DeleteAdminDocument,
    "\n  mutation resendInvitation($id: String!) {\n    resendInvitation(id: $id) {\n      id\n      email\n      expiresAt\n    }\n  }\n": types.ResendInvitationDocument,
    "\n  mutation deleteInvitation($id: String!) {\n    removeInvitation(id: $id) {\n      id\n      email\n    }\n  }\n": types.DeleteInvitationDocument,
    "\n  mutation createCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation updateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n": types.UpdateCompanyDocument,
    "\n  query getCompanies {\n    companies {\n      results {\n        id\n        name\n      }\n    }\n  }\n": types.GetCompaniesDocument,
    "\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n": types.CreateDriveDocument,
    "\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n": types.UpdateDriveDocument,
    "\n  mutation deleteDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n    }\n  }\n": types.DeleteDriveDocument,
    "\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n": types.CreateLevelDocument,
    "\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n": types.UpdateLevelDocument,
    "\n  mutation deleteLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n    }\n  }\n": types.DeleteLevelDocument,
    "\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n": types.CreateLocationDocument,
    "\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n": types.UpdateLocationDocument,
    "\n  mutation deleteLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n    }\n  }\n": types.DeleteLocationDocument,
    "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n": types.DeleteSiteDocument,
    "\n  mutation deleteUserPermission($id: String!) {\n    removeUserPermission(id: $id) {\n      id\n    }\n  }\n": types.DeleteUserPermissionDocument,
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
export function graphql(source: "\n  query getUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n"): (typeof documents)["\n  query getUser($id: String!) {\n    user(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPendingGlobalInvitations {\n    pendingGlobalInvitations {\n      id\n      email\n      globalRole\n      expiresAt\n      used\n    }\n  }\n"): (typeof documents)["\n  query getPendingGlobalInvitations {\n    pendingGlobalInvitations {\n      id\n      email\n      globalRole\n      expiresAt\n      used\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAdmins {\n    users(roles: \"SANDVIK_ADMIN\") {\n      id\n      createdAt\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n"): (typeof documents)["\n  query getAdmins {\n    users(roles: \"SANDVIK_ADMIN\") {\n      id\n      createdAt\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      sandvikAdminUserId\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n        phoneNumber\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompany($id: String!) {\n    company(id: $id) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      sandvikAdminUserId\n      plans {\n        id\n        companyId\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n        phoneNumber\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeCompany($id: String!) {\n    removeCompany(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation removeCompany($id: String!) {\n    removeCompany(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanyPlans($id: String!) {\n    company(id: $id) {\n      id\n      name\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanyPlans($id: String!) {\n    company(id: $id) {\n      id\n      name\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllCompanies($offset: Int, $limit: Int) {\n    companies(offset: $offset, limit: $limit) {\n      totalRecords\n      results {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllCompanies($offset: Int, $limit: Int) {\n    companies(offset: $offset, limit: $limit) {\n      totalRecords\n      results {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query validateInvitation($id: String!, $token: String!) {\n    validateInvitation(id: $id, token: $token) {\n      valid\n      reason\n      invitation {\n        id\n        email\n        companyId\n        globalRole\n        role\n        expiresAt\n        used\n      }\n    }\n  }\n"): (typeof documents)["\n  query validateInvitation($id: String!, $token: String!) {\n    validateInvitation(id: $id, token: $token) {\n      valid\n      reason\n      invitation {\n        id\n        email\n        companyId\n        globalRole\n        role\n        expiresAt\n        used\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation completeInvitation($input: CompleteInvitationInput!) {\n    completeInvitation(input: $input) {\n      id\n      email\n      fullName\n      globalRole\n    }\n  }\n"): (typeof documents)["\n  mutation completeInvitation($input: CompleteInvitationInput!) {\n    completeInvitation(input: $input) {\n      id\n      email\n      fullName\n      globalRole\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCompanyName($id: String!) {\n    company(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      name\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanySitesNames($id: String!) {\n    company(id: $id) {\n      name\n      sites {\n        id\n        siteName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getFullSiteLocations($id: String!) {\n    site(id: $id) {\n      id\n      siteName\n      levels {\n        id\n        levelName\n        siteId\n        drives {\n          id\n          driveName\n          levelId\n          locations {\n            id\n            driveId\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanySites($id: String!) {\n    company(id: $id) {\n      sites {\n        id\n        siteName\n        address\n        city\n        country\n        postalCode\n        companyId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTechnicians {\n    users(roles: \"SANDVIK_TECHNICIAN\") {\n      id\n      fullName\n      email\n      workPlace\n      isGlobalVisibility\n      phoneNumber\n      globalRole\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query getTechnicians {\n    users(roles: \"SANDVIK_TECHNICIAN\") {\n      id\n      fullName\n      email\n      workPlace\n      isGlobalVisibility\n      phoneNumber\n      globalRole\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanyUsers($id: String!) {\n    company(id: $id) {\n      id\n      users {\n        id\n        email\n        fullName\n        workPlace\n        phoneNumber\n        globalRole\n        userPermissions {\n          id\n          userId\n          companyId\n          role\n          appsAccess\n        }\n      }\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanyUsers($id: String!) {\n    company(id: $id) {\n      id\n      users {\n        id\n        email\n        fullName\n        workPlace\n        phoneNumber\n        globalRole\n        userPermissions {\n          id\n          userId\n          companyId\n          role\n          appsAccess\n        }\n      }\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateAccountUser(\n    $id: String!\n    $updateUserInput: UpdateUserInput!\n    $updatePasswordInput: UpdatePasswordInput\n  ) {\n    updateUser(\n      id: $id\n      updateUserInput: $updateUserInput\n      updatePasswordInput: $updatePasswordInput\n    ) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n"): (typeof documents)["\n  mutation updateAccountUser(\n    $id: String!\n    $updateUserInput: UpdateUserInput!\n    $updatePasswordInput: UpdatePasswordInput\n  ) {\n    updateUser(\n      id: $id\n      updateUserInput: $updateUserInput\n      updatePasswordInput: $updatePasswordInput\n    ) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createGlobalInvitation($input: CreateGlobalInvitationInput!) {\n    createGlobalInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n"): (typeof documents)["\n  mutation createGlobalInvitation($input: CreateGlobalInvitationInput!) {\n    createGlobalInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation createSite($createSiteInput: CreateSiteInput!) {\n    createSite(createSiteInput: $createSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation updateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {\n    updateSite(id: $id, updateSiteInput: $updateSiteInput) {\n      id\n      siteName\n      address\n      postalCode\n      city\n      country\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTechnician($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      isGlobalVisibility\n    }\n  }\n"): (typeof documents)["\n  mutation updateTechnician($id: String!, $updateUserInput: UpdateUserInput!) {\n    updateUser(id: $id, updateUserInput: $updateUserInput) {\n      id\n      email\n      isGlobalVisibility\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createInvitation($input: CreateInvitationInput!) {\n    createInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n"): (typeof documents)["\n  mutation createInvitation($input: CreateInvitationInput!) {\n    createInvitation(input: $input) {\n      invitationId\n      isNewUser\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTechniciansByRole($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n      email\n      workPlace\n    }\n  }\n"): (typeof documents)["\n  query getTechniciansByRole($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n      email\n      workPlace\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUserPermission(\n    $id: String!\n    $updateUserPermissionInput: UpdateUserPermissionInput!\n  ) {\n    updateUserPermission(\n      id: $id\n      updateUserPermissionInput: $updateUserPermissionInput\n    ) {\n      id\n      userId\n      role\n      appsAccess\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation updateUserPermission(\n    $id: String!\n    $updateUserPermissionInput: UpdateUserPermissionInput!\n  ) {\n    updateUserPermission(\n      id: $id\n      updateUserPermissionInput: $updateUserPermissionInput\n    ) {\n      id\n      userId\n      role\n      appsAccess\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n    }\n  }\n"): (typeof documents)["\n  query GetUsers($roles: [String]!) {\n    users(roles: $roles) {\n      id\n      fullName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteAdmin($id: String!) {\n    removeUser(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n"): (typeof documents)["\n  mutation deleteAdmin($id: String!) {\n    removeUser(id: $id) {\n      id\n      email\n      fullName\n      workPlace\n      phoneNumber\n      globalRole\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation resendInvitation($id: String!) {\n    resendInvitation(id: $id) {\n      id\n      email\n      expiresAt\n    }\n  }\n"): (typeof documents)["\n  mutation resendInvitation($id: String!) {\n    resendInvitation(id: $id) {\n      id\n      email\n      expiresAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteInvitation($id: String!) {\n    removeInvitation(id: $id) {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation deleteInvitation($id: String!) {\n    removeInvitation(id: $id) {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createCompany($createCompanyInput: CreateCompanyInput!) {\n    createCompany(createCompanyInput: $createCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateCompany(\n    $id: String!\n    $updateCompanyInput: UpdateCompanyInput!\n  ) {\n    updateCompany(id: $id, updateCompanyInput: $updateCompanyInput) {\n      id\n      name\n      orgNumber\n      address\n      postalCode\n      city\n      country\n      companyContactEmail\n      plans {\n        id\n        applicationName\n        planLevel\n        expiringDate\n      }\n      users {\n        id\n        fullName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCompanies {\n    companies {\n      results {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCompanies {\n    companies {\n      results {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"): (typeof documents)["\n  mutation createDrive($createDriveInput: CreateDriveInput!) {\n    createDrive(createDriveInput: $createDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"): (typeof documents)["\n  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {\n    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {\n      id\n      driveName\n      levelId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteDrive($id: String!) {\n    removeDrive(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"): (typeof documents)["\n  mutation createLevel($createLevelInput: CreateLevelInput!) {\n    createLevel(createLevelInput: $createLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"): (typeof documents)["\n  mutation updateLevel($id: String!, $updateLevelInput: UpdateLevelInput!) {\n    updateLevel(id: $id, updateLevelInput: $updateLevelInput) {\n      id\n      levelName\n      siteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteLevel($id: String!) {\n    removeLevel(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"): (typeof documents)["\n  mutation createLocation($createLocationInput: CreateLocationInput!) {\n    createLocation(createLocationInput: $createLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"): (typeof documents)["\n  mutation updateLocation(\n    $id: String!\n    $updateLocationInput: UpdateLocationInput!\n  ) {\n    updateLocation(id: $id, updateLocationInput: $updateLocationInput) {\n      id\n      locationName\n      driveId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteLocation($id: String!) {\n    removeLocation(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n"): (typeof documents)["\n  mutation deleteSite($id: String!) {\n    removeSite(id: $id) {\n      id\n      siteName\n      address\n      city\n      country\n      postalCode\n      companyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteUserPermission($id: String!) {\n    removeUserPermission(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteUserPermission($id: String!) {\n    removeUserPermission(id: $id) {\n      id\n    }\n  }\n"];
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