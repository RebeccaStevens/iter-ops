export {
    IErrorContext,
    IterableExt,
    AsyncIterableExt,
    UnknownIterable,
    UnknownIterator,
    UnknownIterableIterator,
    UnwrapUnknownIterableIterator,
    Operation,
    AsyncOperation,
    SyncOperation,
    SyncValue,
    Value,
    IterationState,
} from './common';

/**
 * These are for code abbreviation + smaller bundles:
 */
export const $S: typeof Symbol.iterator = Symbol.iterator;
export const $A: typeof Symbol.asyncIterator = Symbol.asyncIterator;
