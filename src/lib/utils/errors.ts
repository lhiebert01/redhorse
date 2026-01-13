export class ProphecyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ProphecyError';
  }
}

export const ErrorCodes = {
  INVALID_SESSION: 'INVALID_SESSION',
  GENERATION_FAILED: 'GENERATION_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  WEBHOOK_INVALID: 'WEBHOOK_INVALID',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export function isRetryableError(error: unknown): boolean {
  if (error instanceof ProphecyError) {
    return [ErrorCodes.GENERATION_FAILED, ErrorCodes.STORAGE_ERROR].includes(
      error.code as (typeof ErrorCodes)[keyof typeof ErrorCodes]
    );
  }

  // Retry on network errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('rate limit') ||
      message.includes('503') ||
      message.includes('429')
    );
  }

  return false;
}
