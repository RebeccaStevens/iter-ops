import {_asyncValues, expect} from '../../header';
import {pipeAsync, defaultEmpty} from '../../../src';

export default () => {
    it('must not add to a non-empty source', async () => {
        const output = pipeAsync([1], defaultEmpty(2));
        expect(await _asyncValues(output)).to.eql([1]);
    });
    describe('for an empty source', () => {
        it('must add values', async () => {
            const output = pipeAsync([], defaultEmpty(123));
            expect(await _asyncValues(output)).to.eql([123]);
        });
        it('must add iterators', async () => {
            let value = 4;
            const input: Iterator<number> = {
                next() {
                    if (value--) {
                        return {value};
                    }
                    return {value: undefined, done: true};
                },
            };
            const output = pipeAsync([], defaultEmpty(input));
            expect(await _asyncValues(output)).to.eql([3, 2, 1, 0]);
        });
        it('must treat "next" property as value', async () => {
            const output = pipeAsync([], defaultEmpty({next: 123}));
            expect(await _asyncValues(output)).to.eql([{next: 123}]);
        });
        it('must add iterables', async () => {
            const output = pipeAsync([], defaultEmpty([1, 2]));
            expect(await _asyncValues(output)).to.eql([1, 2]);
        });
    });
    describe('type inference', () => {
        it('must work for values', async () => {
            // the actual test here is compile-time, inferring the type correctly:
            const i: AsyncIterable<number | string> = pipeAsync(
                [1, 2, 3],
                defaultEmpty('hello')
            );
            expect(await _asyncValues(i)).to.eql([1, 2, 3]); // default not added
        });
        it('must work for iterators', async () => {
            const value = 'hello';
            let done = false;
            const input: Iterator<string> = {
                next() {
                    if (!done) {
                        done = true;
                        return {value};
                    }
                    return {value: undefined, done};
                },
            };
            // the actual test here is compile-time, inferring the type correctly;
            // NOTE: This case does require casting input as Iterator<string> :|
            const i: AsyncIterable<number | string> = pipeAsync(
                [1, 2, 3],
                defaultEmpty(input)
            );
            expect(await _asyncValues(i)).to.eql([1, 2, 3]); // default not added
        });
        it('must work for iterables', async () => {
            // the actual test here is compile-time, inferring the type correctly:
            const i: AsyncIterable<number | string | boolean> = pipeAsync(
                [1, 2, 3],
                defaultEmpty(['hello', true])
            );
            expect(await _asyncValues(i)).to.eql([1, 2, 3]); // default not added
        });
    });
};
