import {_async, _asyncValues, expect, YSNP} from './header';
import {pipe, tap, catchError} from '../src';

describe('sync catchError', () => {
    it('must continue without value', () => {
        const reports: any[] = [];
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, ctx) => {
                reports.push({err: err?.message, index: ctx.index, lastValue: ctx.lastValue, repeats: ctx.repeats});
            })
        );
        const result = [...i];
        expect(result).to.eql([1, 2, 4, 5]);
        expect(reports).to.eql([{err: 'ops-3', index: 2, lastValue: 2, repeats: 0}]);
    });
    it('must report repeated errors', () => {
        const repeatCounts: number[] = [];
        const i = pipe([1, 2, 3, 4, 5], tap(a => {
            throw 'ops!';
        })).catch((e, ctx) => {
            if (ctx.repeats > 2) {
                throw 'stop';
            }
            repeatCounts.push(ctx.repeats);
        });
        let err: any;
        try {
            [...i];
        } catch (e) {
            err = e;
        }
        expect(err).to.eql('stop');
        expect(repeatCounts).to.eql([0, 1, 2]);
    });
    it('must inject a manually emitted value', () => {
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            })
        )
            .catch((err, info) => {
                info.emit(333);
            });
        const result = [...i];
        expect(result).to.eql([1, 2, 333, 4, 5]);
    });
    it('must allow re-throwing', () => {
        const i = pipe(
            [1],
            tap(() => {
                throw new Error('ops');
            }),
            catchError(() => {
                throw new Error('handled');
            })
        );
        expect(() => {
            [...i];
        }).to.throw('handled');
    });
});

describe('async catchError', () => {
    it('must continue without value', async () => {
        const reports: any[] = [];
        const i = pipe(
            _async([1, 2, 3, 4, 5]),
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, ctx) => {
                reports.push({err: err?.message, index: ctx.index, lastValue: ctx.lastValue, repeats: ctx.repeats});
            })
        );
        const result = await _asyncValues(i);
        expect(result).to.eql([1, 2, 4, 5]);
        expect(reports).to.eql([{err: 'ops-3', index: 2, lastValue: 2, repeats: 0}]);
    });
    it('must report repeated errors', async () => {
        const repeatCounts: number[] = [];
        const i = pipe(_async([1, 2, 3, 4, 5]), tap(a => {
            throw 'ops!';
        })).catch((e, ctx) => {
            if (ctx.repeats > 2) {
                throw 'stop';
            }
            repeatCounts.push(ctx.repeats);
        });
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err).to.eql('stop');
        expect(repeatCounts).to.eql([0, 1, 2]);
    });
    it('must inject a manually emitted value', async () => {
        const i = pipe(
            _async([1, 2, 3, 4, 5]),
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            })
        )
            .catch((err, info) => {
                info.emit(333);
            });
        const result = await _asyncValues(i);
        expect(result).to.eql([1, 2, 333, 4, 5]);
    });
    it('must allow re-throwing', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            tap(() => {
                throw new Error('ops');
            }),
            catchError(() => {
                throw new Error('handled');
            })
        );
        let err: Error;
        try {
            await _asyncValues(i);
            YSNP();
        } catch (e) {
            err = e as Error;
        }
        expect(err!.message).to.eql('handled');
    });
});