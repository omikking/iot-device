export function isPasswordStrong(password: string): boolean {
  // Check if password is at least 8 characters
  if (password.length < 8) return false;

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) return false;

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) return false;

  // Check for numbers
  if (!/[0-9]/.test(password)) return false;

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

  return true;
}
