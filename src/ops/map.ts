import {IterationState, Piper} from '../types';

/**
 * Implements standard map logic for the iterable,
 * extended for supporting iteration state.
 */
export function map<T, R>(cb: (value: T, index: number, state: IterationState) => R): Piper<T, R> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            const i = iterable[Symbol.iterator]();
            const state = {};
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            return {value: cb(a.value, index++, state)};
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
