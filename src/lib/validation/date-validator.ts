/**
 * Date Validation for Red Horse Oracle
 *
 * Valid birth year range: 1910 - 2027
 * - 1910: Oldest reasonable living person
 * - 2027: End of Fire Horse Year (Feb 2027)
 *
 * This prevents:
 * - Spoofing/hacking attempts with invalid dates
 * - Generating forecasts for impossible ages
 * - App abuse with extreme date values
 */

export const MIN_BIRTH_YEAR = 1910;
export const MAX_BIRTH_YEAR = 2027;

export interface DateValidationResult {
  isValid: boolean;
  year?: number;
  errorMessage?: string;
}

/**
 * Validates a birth date string and returns validation result
 * @param dateString - Date string in YYYY-MM-DD format (from input type="date")
 * @returns DateValidationResult with isValid flag and optional error message
 */
export function validateBirthDate(dateString: string): DateValidationResult {
  if (!dateString) {
    return {
      isValid: false,
      errorMessage: 'Please enter your birth date.'
    };
  }

  // Parse the date
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid date format.'
    };
  }

  const year = date.getFullYear();

  // Check year range
  if (year < MIN_BIRTH_YEAR) {
    return {
      isValid: false,
      year,
      errorMessage: `The Red Horse Oracle is designed for people currently living. Birth years before ${MIN_BIRTH_YEAR} are outside our supported range. Please enter a birth year between ${MIN_BIRTH_YEAR} and ${MAX_BIRTH_YEAR}.`
    };
  }

  if (year > MAX_BIRTH_YEAR) {
    return {
      isValid: false,
      year,
      errorMessage: `The Red Horse Oracle generates forecasts for the Fire Horse Year 2026. Birth years after ${MAX_BIRTH_YEAR} are outside our supported range. Please enter a birth year between ${MIN_BIRTH_YEAR} and ${MAX_BIRTH_YEAR}.`
    };
  }

  // Additional sanity check: date shouldn't be in the future
  const today = new Date();
  if (date > today) {
    return {
      isValid: false,
      year,
      errorMessage: 'Birth date cannot be in the future. Please enter your actual birth date.'
    };
  }

  return {
    isValid: true,
    year
  };
}

/**
 * Extract birth year from date string
 * @param dateString - Date string in various formats
 * @returns Year as number or null if invalid
 */
export function extractBirthYear(dateString: string): number | null {
  if (!dateString) return null;

  // Try parsing as date
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.getFullYear();
  }

  // Try extracting year from MM/DD/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const year = parseInt(parts[2], 10);
    if (!isNaN(year) && year >= 1000 && year <= 9999) {
      return year;
    }
  }

  return null;
}

/**
 * Get a friendly error message component text for display
 */
export function getValidationErrorDisplay(errorMessage: string): {
  title: string;
  message: string;
} {
  return {
    title: '🐴 Date Outside Supported Range',
    message: errorMessage
  };
}
