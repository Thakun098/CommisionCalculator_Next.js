// Validation functions for Commission Calculator

/**
 * Check if a string is a valid integer
 */
export const isInteger = (value: string): boolean => {
  return /^-?\d+$/.test(value.trim());
};

/**
 * Validate name field - must be non-empty and English letters only
 */
export const validateName = (name: string): string => {
  const englishOnlyRegex = /^[a-zA-Z\s]+$/;
  
  if (name.trim() === '') {
    return 'Please enter Employee Name';
  }
  if (!englishOnlyRegex.test(name)) {
    return 'Name is not valid, please enter in english.';
  }
  return '';
};

/**
 * Validate a numeric field - checks for empty and integer format
 */
export const validateNumericField = (value: string, fieldName: string): string => {
  if (value.trim() === '') {
    return `Please enter ${fieldName}`;
  }
  if (!isInteger(value)) {
    return 'Please enter with integer or whole number';
  }
  return '';
};

/**
 * Validate input ranges for locks, stocks, and barrels
 * - Locks: 1-70
 * - Stocks: 1-80
 * - Barrels: 1-90
 */
export const validateInputRanges = (locks: number, stocks: number, barrels: number): string[] => {
  const errors: string[] = [];
  
  if (isNaN(locks) || locks < 1 || locks > 70) {
    errors.push('Locks must be between 1 and 70');
  }
  if (isNaN(stocks) || stocks < 1 || stocks > 80) {
    errors.push('Stocks must be between 1 and 80');
  }
  if (isNaN(barrels) || barrels < 1 || barrels > 90) {
    errors.push('Barrels must be between 1 and 90');
  }
  
  return errors;
};
