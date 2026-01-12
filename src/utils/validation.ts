/* eslint-disable no-useless-escape */
export const validatePassword = (password: string): string | true => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return true;
};

export const validateName = (name: string): string | true => {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!/^[A-Z]/.test(trimmed)) {
    return "Name must start with a capital letter";
  }

  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return "Name must contain at least one letter";
  }
  return true;
};

export const validateEmail = (email: string): string | true => {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

  if (!emailRegex.test(trimmed)) {
    return "Email must end with .com";
  }

  return true;
};
