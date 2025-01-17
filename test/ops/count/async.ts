import {_async, expect} from '../../header';
import {pipeAsync, count} from '../../../src';

export default () => {
    it('must count items correctly', async () => {
        const input = [10, 20, 30];
        const output = pipeAsync(_async(input), count());
        expect(await output.first).to.eql(input.length);
    });
    it('must handle empty iterables', async () => {
        const output = pipeAsync([], count());
        expect(await output.first).to.eql(0);
    });
    it('must not generate more than one value', async () => {
        const input = [10, 20, 30];
        const output = pipeAsync(_async(input), count());
        const i = output[Symbol.asyncIterator]();
        const result = (await i.next()) && (await i.next());
        expect(result).to.eql({value: undefined, done: true});
    });
    it('must use sync predicate', async () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output1 = pipeAsync(
            input,
            count((a) => a % 2 === 0)
        );
        const output2 = pipeAsync(
            input,
            count((a) => a % 2 > 0)
        );
        expect(await output1.first).to.eql(4);
        expect(await output2.first).to.eql(5);
    });
    it('must use async predicate', async () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipeAsync(
            input,
            count(async (a) => a % 2 === 0)
        );
        expect(await output.first).to.eql(4);
    });
};
