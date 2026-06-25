/**
 * Retry Utilities
 * Exponential backoff retry logic with max 5 retries.
 * Only retries on network errors and 5xx server errors.
 */

const BACKOFF_SCHEDULE_MS = [1000, 2000, 4000, 8000, 16000] as const;
const MAX_RETRIES = 5;

/**
 * Determines if an error is retryable based on error type or HTTP status code.
 * Does not retry on 4xx client errors.
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const retryableMessages = ["timeout", "network", "ECONN", "ETIMEDOUT", "ENOTFOUND", "EHOSTUNREACH"];
    const message = error.message.toLowerCase();
    if (retryableMessages.some(msg => message.includes(msg))) {
      return true;
    }
  }

  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    const status = response?.status;
    if (status && status >= 500 && status < 600) {
      return true;
    }
  }

  return false;
}

/**
 * Exponential backoff retry wrapper.
 * Retries failed operations up to MAX_RETRIES times with increasing delays.
 * Throws the last error if all retries fail.
 */
export async function retry<T>(
  operation: () => Promise<T>,
  retryCount = 0,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retryCount >= MAX_RETRIES || !isRetryableError(error)) {
      throw error;
    }

    const delay = BACKOFF_SCHEDULE_MS[retryCount] ?? BACKOFF_SCHEDULE_MS[BACKOFF_SCHEDULE_MS.length - 1];
    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    return retry(operation, retryCount + 1);
  }
}

/**
 * Sleep utility for manual backoff control.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}