import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Expands / flattens sub-iterables up to the specified `depth` (default is 1).
 *
 * ```ts
 * import {pipe, flat} from 'iter-ops';
 *
 * const i = pipe(
 *     ['one', [2, 3, [4, 5]]],
 *     flat(2)
 * );
 *
 * console.log(...i); //=> 'o', 'n', 'e', 2, 3, 4, 5
 * ```
 *
 * It implements the logic consistent with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()},
 * handling non-iterable values without throwing errors (unlike {@link spread}), and with optional `depth` support.
 *
 * Compare to a more strict {@link spread} operator.
 *
 * @see
 *  - {@link spread}
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()}
 * @category Sync+Async
 */
export function flat<T>(
    depth?: number
): Operation<Iterable<T | Iterable<T>> | AsyncIterable<T>, T>;

export function flat(...args: unknown[]) {
    return createOperation(flatSync, flatAsync, args);
}

function flatSync<T>(
    iterable: Iterable<Iterable<T>>,
    depth = 1
): Iterable<T | Iterable<T>> {
    return {
        [$S](): Iterator<T | Iterable<T>> {
            const d: Iterator<T | Iterable<T>>[] = new Array(depth + 1);
            d[0] = iterable[$S]();
            let level = 0;
            return {
                next(): IteratorResult<T | Iterable<T>> {
                    do {
                        const v = d[level].next(); // next value
                        if (v.done) {
                            if (!level) {
                                return v; // we are finished
                            }
                            level--; // back to upper level
                            continue;
                        }
                        if (level === depth) {
                            return v; // maximum depth reached
                        }
                        const i = (v.value as Iterable<T>)?.[$S]?.();
                        if (!i) {
                            return v; // non-iterable value
                        }
                        d[++level] = i;
                    } while (true);
                },
            };
        },
    };
}

function flatAsync<T>(
    iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>,
    depth = 1
): AsyncIterable<T | Iterable<T>> {
    type AnyValue = T | Iterator<T> | AsyncIterator<T>;
    return {
        [$A](): AsyncIterator<T> {
            const d: {i: any; sync: boolean}[] = new Array(depth + 1);
            d[0] = {i: iterable[$A](), sync: false};
            let level = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    const v = d[level].i.next(); // next value
                    if (d[level].sync) {
                        if (v.done) {
                            level--; // back to upper level
                            return this.next();
                        }
                        if (level === depth) {
                            return Promise.resolve(v); // maximum depth reached
                        }
                        let i: AnyValue = v.value?.[$S]?.(); // first try with sync
                        let sync = true;
                        if (!i) {
                            i = v.value?.[$A]?.(); // then try with async
                            if (!i) {
                                return Promise.resolve(v); // non-iterable value
                            }
                            sync = false;
                        }
                        d[++level] = {i, sync};
                        return this.next();
                    }
                    return v.then(
                        (
                            a: IteratorResult<
                                T | Iterable<T> | AsyncIterable<T>
                            >
                        ) => {
                            if (a.done) {
                                if (!level) {
                                    return a; // we are finished
                                }
                                level--; // back to upper level
                                return this.next();
                            }
                            if (level === depth) {
                                return a; // maximum depth reached
                            }
                            let i: AnyValue = (a.value as AsyncIterable<T>)?.[
                                $A
                            ]?.(); // first, try with async
                            let sync = false;
                            if (!i) {
                                i = (a.value as Iterable<T>)?.[$S]?.(); // then try with sync
                                if (!i) {
                                    return a; // non-iterable value
                                }
                                sync = true;
                            }
                            d[++level] = {i, sync};
                            return this.next();
                        }
                    );
                },
            };
        },
    };
}
