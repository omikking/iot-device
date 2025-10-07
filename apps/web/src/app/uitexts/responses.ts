export const responses = {
  passwordMismatchError: 'Passwords do not match.',

  // misc error responses
  contactSupportError: 'Please contact our support team for assistance.',
  accessDeniedError_title: 'Access Denied',
  accessDeniedError_message:
    'You do not have permission to perform this action.',

  // Site
  createSiteError: 'Failed to add site',
  siteCreateSuccess: 'Site successfully added',
  updateSiteError: 'Failed to update site',
  siteSuccessfulUpdate: 'Site successfully updated',
  siteDeleteFailed: 'Failed to delete site',
  siteDeleteSuccess: 'Site has been deleted',

  // Site location
  levelCreateSuccess: 'Level successfully added',
  levelDeleteSuccess: 'Level has been deleted',
  levelUpdateSuccess: 'Level successfully updated',
  levelCreateError: 'Failed to add level',
  levelUpdateError: 'Failed to update level',
  levelDeleteError: 'Failed to delete level',

  driveCreateSuccess: 'Drive successfully added',
  driveUpdateSuccess: 'Drive successfully updated',
  driveDeleteSuccess: 'Drive has been deleted',
  driveCreateError: 'Failed to add drive',
  driveUpdateError: 'Failed to update drive',
  driveDeleteError: 'Failed to delete drive',

  locationCreateSuccess: 'Location successfully added',
  locationUpdateSuccess: 'Location successfully updated',
  locationDeleteSuccess: 'Location has been deleted',
  locationCreateError: 'Failed to add location',
  locationUpdateError: 'Failed to update location',
  locationDeleteError: 'Failed to delete location',

  siteLocationDeleteError: (siteLocationType: 'level' | 'drive' | 'location') =>
    'Failed to delete ' + siteLocationType,

  // Account setup
  failedToSetupAccountError: 'Failed to set up account',
  createAccountSetupSuccess: 'Account successfully set up',

  // Technician
  technicianInviteFailError: 'Failed to invite technician',
  technicianInviteSuccess: 'Invitation successfully sent',
  technicianUpdateFailedError: 'Failed to update technician',
  technicianUpdateSuccess: 'Technician successfully updated',
  technicianDeleteFailed: 'Failed to delete technician',
  technicianDeleteSuccess: 'Technician has been deleted',

  //company
  companyInvitationFailed: 'Failed to send invitation to company',
  successfulCompanyCreation: 'Invitation successfully sent',
  companyUpdateFailed: 'Failed to update company',
  successfulCompanyUpdate: 'Company successfully updated',
  companyDeletionFailed: 'Failed to delete company',
  companyDeleteSuccess: 'Company account has been deleted',

  // Sign in
  signInFailed: 'Failed to sign in',

  // Administrator
  adminInviteFailError: 'Failed to invite administrator',
  adminInviteSuccess: 'Invitation successfully sent',
  adminDeleteFailed: 'Failed to delete administrator',
  adminDeleteSuccess: 'Administrator has been deleted',

  // Invitation
  invitationResendFailed: 'Failed to resend invitation',
  invitationResendSuccess: 'Invitation successfully resent',
  invitationCancelFailed: 'Failed to cancel invitation',
  invitationCancelSuccess: 'Invitation has been cancelled',

  // User permissions
  userPermissionCreateFailed: 'Failed to add user permissions',
  userPermissionCreateSuccess: 'Invitation for permissions successfully sent',
  userPermissionUpdateFailed: 'Failed to update user permissions',
  userPermissionUpdateSuccess: 'User permissions successfully updated',
  userPermissionDeleteFailed: 'Failed to delete user permissions',
  userPermissionDeleteSuccess: 'User permissions has been deleted',

  // Account settings
  settingsUpdateFailed: 'Failed to update account settings',
  settingsUpdateSuccess: 'Account settings successfully updated',

  // Reset password
  resetPasswordEmailSent: 'You will receive a code shortly.',
  resetPasswordEmailFailed: 'Failed to send email.',
  resetPasswordCodeVerifiedSuccess:
    'Code verified, you can now reset your password.',
  resetPasswordCodeFailed: 'Failed to verify code.',
  resetPasswordSuccess: 'Password has been successfully reset.',
  resetPasswordFailed: 'Failed to reset password.',
};
