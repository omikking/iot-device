export const validations = {
  // misc validations
  emailInvalid: 'Email must be a valid email address.',
  passwordMin8Chars: 'Password must be at least 8 characters.',

  max50Chars: (inputField: string) =>
    `${inputField} must be at most 50 characters.`,
};
