/**
 * Throttle Utility
 * 
 * Provides a generic throttle function for rate-limiting function calls.
 * Used primarily for limiting cursor position updates to reduce database writes
 * while maintaining smooth real-time updates.
 */

/**
 * Creates a throttled version of a function that only executes at most once
 * per specified time period.
 * 
 * The throttled function will:
 * - Execute immediately on first call
 * - Ignore subsequent calls within the delay period
 * - Execute again with the most recent arguments after delay expires
 * 
 * @param func - The function to throttle
 * @param delay - Minimum time in milliseconds between function executions
 * @returns A throttled version of the input function
 * 
 * @example
 * const throttledUpdate = throttle((x: number, y: number) => {
 *   updateCursorPosition(x, y);
 * }, 100);
 * 
 * // Called 50 times in 1 second -> executes ~10 times
 * throttledUpdate(10, 20);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // If enough time has passed, execute immediately
    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      // Schedule execution for when delay period completes
      const remainingTime = delay - timeSinceLastCall;
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, remainingTime);
    }
  };
}

