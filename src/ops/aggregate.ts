import {Piper} from '../types';

/**
 *
 */
export function aggregate<T, R>(cb: (arr: T[]) => R): Piper<T, R> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            const i = iterable[Symbol.iterator]();
            let done = false;
            return {
                next(): IteratorResult<R> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr: T[] = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: cb(arr)};
                }
            };
        }
    });
}
