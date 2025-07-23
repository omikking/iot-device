export const validations = {
  // misc validations
  emailRequired: 'Email must be provided.',
  emailInvalid: 'Email must be a valid email address.',

  passwordMin8Chars: 'Password must be at least 8 characters.',
  passwordsMismatch: 'Passwords do not match.',
  confirmPasswordRequired: 'Please confirm your password.',

  max50Chars: (inputField: string) =>
    `${inputField} must be at most 50 characters.`,

  adminRequired: 'Sandvik administrator must be selected.',
  roleRequired: 'Role must be selected.',
  technicianRequired: 'Technician must be selected.',

  driveWhitespace: 'Drive name cannot be mostly whitespace.',
  levelWhitespace: 'Level name cannot be mostly whitespace.',
  locationWhitespace: 'Location name cannot be mostly whitespace.',
};
