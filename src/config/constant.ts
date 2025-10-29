export const DEFAULT_FAVORITE_COUNT = 0;

export const SALT_HASH_PASSWORD = 10;

// Common pagination constants
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  MIN_OFFSET: 0,
} as const;

// Validation regex patterns
export const VALIDATION_REGEX = {
  // Email validation - RFC 5322 compliant
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Username - alphanumeric and underscores only
  USERNAME: /^[a-zA-Z0-9_]+$/,
  
  // Password - at least one letter, one number, and one special character
  PASSWORD_STRONG: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  
  // Slug - lowercase letters, numbers, and hyphens
  SLUG: /^[a-z0-9-]+$/,
} as const;

// Field length constraints
export const FIELD_LENGTH = {
  // User entity
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  EMAIL_MIN: 5,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 255,
  BIO_MIN: 0,
  BIO_MAX: 1000,
  
  // Article entity
  TITLE_MIN: 5,
  TITLE_MAX: 255,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 500,
  SLUG_MIN: 3,
  SLUG_MAX: 255,
  BODY_MIN: 10,
  BODY_MAX: 10000,
  
  // Comment entity
  COMMENT_MIN: 1,
  COMMENT_MAX: 2000,
  
  // Tag entity
  TAG_NAME_MIN: 1,
  TAG_NAME_MAX: 100,
} as const;
