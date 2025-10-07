export const errorTexts = {
  // General errors
  contactSupportError: 'Please contact our support team for assistance.',
  permissionsDenied: 'Permission denied',

  // Bolt result
  boltResultNotFound_title: (id: string) => `Bolt result #${id} not found`,

  boltResultCreationError_title: 'Failed to create bolt result',

  boltResultUpdateError_title: 'Failed to update bolt result',

  boltResultRequired_title: 'Bolt result required',
  boltResultRequired_message: 'At least one bolt result is required.',

  boltResultSiteIdMismatch_title: 'Site ID mismatch',
  boltResultSiteIdMismatch_message:
    'All items must have the same siteId as the top-level argument.',

  boltResultsNoUpdates_title: 'No updates provided',
  boltResultsNoUpdates_message:
    'Please provide at least one update to apply to bolt results.',

  boltResultsIdMissing_title: 'Missing ID',
  boltResultsIdMissing_message: 'Each bolt result update must include an ID.',

  boltResultsIdRequired_title: 'IDs Required',
  boltResultsIdRequired_message:
    'Please provide the IDs of bolt results to update.',

  boltResultsNotFoundError_title: 'Missing IDs',
  boltResultsNotFoundError_message:
    'No bolt results found for the provided IDs.',

  boltResultDeleteError_title: 'Failed to delete bolt result',

  boltResultHazardCompletionError_title: 'Failed to complete hazard',

  // Company
  companyNotFound_title: (id: string) => `Company #${id} not found`,

  companyAdminRequired_title: 'Admin is required',

  companyAdminNotFound_title: 'Admin provided not found',

  companyUserNotAdmin_title: 'User provided is not an Admin',

  companyCreateError_title: 'Failed to send invitation to company',

  companyUpdateError_title: 'Failed to update company',

  companyAlreadyExists_title: 'Company already exists',
  companyAlreadyExists_message: 'This company is already registered.',

  companyDeleteError_title: 'Failed to delete company',

  // Drive
  driveNotFound_title: (id: string) => `Drive #${id} not found`,

  driveCreateError_title: 'Failed to add drive',

  driveUpdateError_title: 'Failed to update drive',

  driveDeleteError_title: 'Failed to delete drive',

  duplicateDriveWarning_title: 'Duplicated drive',

  // Level
  levelNotFound_title: (id: string) => `Level #${id} not found`,

  levelCreateError_title: 'Failed to add level',

  levelUpdateError_title: 'Failed to update level',

  levelDeleteError_title: 'Failed to delete level',

  duplicateLevelWarning_title: 'Duplicated level',

  // Location
  locationNotFound_title: (id: string) => `Location #${id} not found`,

  locationCreateError_title: 'Failed to add location',

  locationUpdateError_title: 'Failed to update location',

  locationDeleteError_title: 'Failed to delete location',

  duplicateLocationWarning_title: 'Duplicated location',

  duplicateSiteLocationWarning_message: (
    siteLocationType: 'level' | 'drive' | 'location',
  ) =>
    `A ${siteLocationType} with this name already exists. Please choose a different name.`,

  // Site
  siteNotFound_title: (id: string) => `Site #${id} not found`,

  siteAlreadyExists_title: 'Site already exists',

  siteCreateError_title: 'Failed to add site',

  siteUpdateError_title: 'Failed to update site',

  siteDeleteError_title: 'Failed to delete site',

  // User Permissions
  userPermissionNotFound_title: (id: string) =>
    `User permission #${id} not found`,

  userNotFoundByEmail_title: 'User not found',
  userNotFoundByEmail_message: (email: string) =>
    `User with email ${email} could not be found.`,

  userPermissionAlreadyExists_title: 'Permissions already exist',
  userPermissionAlreadyExists_message:
    'User already has permissions for this company. Please edit the existing permissions instead.',

  userPermissionCreateError_title: 'Failed to add user permissions',

  userPermissionUpdateError_title: 'Failed to update user permissions',

  userPermissionDeleteError_title: 'Failed to delete user permissions',

  // User related errors
  userNotFound_title: (id: string) => `User #${id} not found`,

  userPasswordFieldsRequired_title: 'All password fields required',

  userIncorrectPassword_title: 'Incorrect password',
  userIncorrectPassword_message:
    'The current password you entered is incorrect.',

  userPasswordMismatch_title: 'Password mismatch',
  userPasswordMismatch_message:
    'New password and confirm password do not match.',

  userPasswordTooWeak_message:
    'Please provide a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.',

  userPasswordTooShort_message: 'Password must be at least 8 characters',

  userUpdateError_title: 'Failed to update user',

  userDeleteError_title: 'Failed to delete user',

  // Auth related errors
  authEmailExists_title: 'Email already exists',
  authEmailExists_message: 'An account with this email already exists.',

  authSetupAccountError_title: 'Failed to set up account',

  authInvalidCredentials_title: 'Failed to sign in',
  authInvalidCredentials_message:
    'The email or password you entered is incorrect.',

  // Refresh token
  authRefreshTokenError_title: 'Invalid refresh token',
  authAccessDenied_title: 'Access denied',

  authUserError_title: 'Authentication failed',

  // Invitation
  invitationNotFound_title: (id: string) => `Invitation #${id} not found`,

  invitationCompanyNotFound_title: 'Company not found',
  invitationCompanyNotFound_message:
    'The company specified in the invitation does not exist.',

  invitationAlreadyUsed_title: 'Invitation already used',
  invitationAlreadyUsed_message: 'This invitation has already been used.',

  invitationExpired_title: 'Invitation expired',
  invitationExpired_message:
    'This invitation has expired. Please request a new one.',

  invitationInvalidToken_title: 'Invalid invitation',
  invitationInvalidToken_message:
    'The invitation is invalid or does not exist.',

  invitationDuplicate_title: 'Invitation already exists',
  invitationDuplicate_message:
    'A pending invitation already exists for this email.',

  invitationUserExists_title: 'User already exists',
  invitationUserExists_message:
    'A user with this email already has access to this company. Edit from the existing access instead.',

  invitationCreateError_title: 'Failed to create invitation',

  invitationCompleteError_title: 'Failed to complete invitation',

  invitationResendError_title: 'Failed to resend invitation',

  invitationRemoveError_title: 'Failed to remove invitation',

  invitationRateLimit_title: 'Too many invitations',
  invitationRateLimit_message:
    'Please wait before sending another invitation to this email.',

  otpCreateError_title: 'Failed to send a reset password code',

  otpValidationError_title: 'Invalid reset password code',

  otpTokenExpired_title: 'Reset password code expired',
  otpTokenExpired_message:
    'The reset password code has expired. Please request a new one.',
};
