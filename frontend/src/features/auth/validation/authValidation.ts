/**
 * AutoServe Client-Side Validation Rules
 */

export interface PasswordRequirementsState {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const checkPasswordRequirements = (password: string): PasswordRequirementsState => {
  return {
    hasMinLength: password.length >= 8 && password.length <= 72,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
};

export const isPasswordValid = (requirements: PasswordRequirementsState): boolean => {
  return (
    requirements.hasMinLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar
  );
};

export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'Phone number must be exactly 10 digits';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2 || name.trim().length > 100) {
    return 'Name must be between 2 and 100 characters';
  }
  return null;
};
