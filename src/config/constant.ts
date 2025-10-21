export const DEFAULT_FAVORITE_COUNT = 0;

// Field length constraints
export const FIELD_LENGTH = {
  // User entity
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  EMAIL_MAX: 255,
  PASSWORD_MAX: 255,
  BIO_MAX: 1000,
  
  // Article entity
  TITLE_MIN: 5,
  TITLE_MAX: 255,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 500,
  SLUG_MAX: 255,
  
  // Comment entity
  COMMENT_MIN: 1,
  COMMENT_MAX: 2000,
  
  // Tag entity
  TAG_NAME_MIN: 1,
  TAG_NAME_MAX: 100,
} as const;