import {Piper} from '../types';

/**
 * Implements standard reducer for the iterable;
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let done = false;
            return {
                next(): IteratorResult<T> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    let index = 0;
                    value = initialValue as T;
                    for (const curr of iterable) {
                        if (!index++ && value === undefined) {
                            value = curr;
                            continue;
                        }
                        value = cb(value, curr, index++);
                    }
                    done = true;
                    return {value};
                }
            };
        }
    });
}