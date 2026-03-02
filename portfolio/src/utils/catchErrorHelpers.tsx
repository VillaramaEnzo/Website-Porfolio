/**
 * A utility function that wraps a promise to handle errors in a structured way.
 * Returns a tuple containing either [undefined, data] on success or [error] on failure.
 * 
 * This is a simple error handling wrapper that implements the "Go-style" error handling pattern.
 * Instead of using try/catch, it returns a tuple where:
 * 
 * - On success, it returns [undefined, data]
 * - On failure, it returns [error]
 * 
 * This makes error handling more explicit and easier to work with. 
 * Enabling cleaner code flow. 
 * 
 * 
 * @template T - The type of data that the promise resolves to
 * @param {Promise<T>} promise - The promise to be handled
 * @returns {Promise<[undefined, T] | [Error]>} A promise that resolves to either [undefined, data] or [error]
 * 
 * @example
 * const [error, data] = await catchError(fetchUserData());
 * if (error) {
 *   console.error('Error fetching user:', error);
 * } else {
 *   console.log('User data:', data);
 * }
 */
export function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
    return promise
        .then((data) => {
            return [undefined, data] as [undefined, T]
        })
        .catch((error) => {
            return [error]
        })
}

/** 
 * An advanced error handling function that allows for selective error catching based on error types.
 * Returns a tuple containing either [undefined, data] on success or [error] on caught errors.
 * Uncaught errors are re-thrown.
 * 
 * This is a more sophisticated version of catchError.
 * It allows for selective error catching based on error types.
 * 
 * Key Features:
 * - Accepts specific error types to catch.
 * - Only catches errors that match the specified types.
 * - Uncaught errors are re-thrown.
 * 
 * This pattern is particularly useful when you want to:
 * - Avoid using generic try/catch error handling.
 * - Handle specific errors in a different way than others.
 * - Preserve the type of the error for more precise error handling.
 * - Avoid swallowing errors in cases where each error needs to be handled differently.
 * 
 * 
 * @template T - The type of data that the promise resolves to
 * @template E - The type of error constructor extending Error
 * @param {Promise<T>} promise - The promise to be handled
 * @param {E[]} [errorsToCatch] - Optional array of error constructors to catch
 * @returns {Promise<[undefined, T] | [InstanceType<E>]>} A promise that resolves to either [undefined, data] or [error]
 * 
 * @example
 * const [error, data] = await catchErrorCustom(
 *   fetchUserData(),
 *   [NetworkError, ValidationError]
 * );
 * if (error) {
 *   console.error('Caught specific error:', error);
 * } else {
 *   console.log('User data:', data);
 * }
 */
export function catchErrorCustom<T, E extends new (message?: string) => Error>(
    promise: Promise<T>,
    errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
    return promise
        .then((data) => {
            return [undefined, data] as [undefined, T]
        })
        .catch((error) => {
            if (errorsToCatch == undefined) {
                return [error]
            }
            if (errorsToCatch.some(e => error instanceof e)) {
                return [error]
            }
            throw error
        })
}