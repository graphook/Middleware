

export const emailRegex = '^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
export const usernameRegex = '^[a-zA-Z0-9\\-_]{3,30}$';
export const passwordRegex = '^[a-zA-Z0-9$-/:-?{-~!\"^_`\\[\\]]';
export const numberRegex = '^[0-9]*$';
export const validTypes = new Set([
  'object',
  'array',
  'keyword',
  'text',
  'long',
  'integer',
  'short',
  'byte',
  'double',
  'float',
  'date',
  'boolean',
  'any'
]);
