import {_asyncValues, expect} from '../../header';
import {pipeAsync, reduce} from '../../../src';

export default () => {
    it('must work with initial value', async () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipeAsync(
            input,
            reduce((c, i) => c + i, 5)
        );
        expect(await output.first).to.eql(50);
    });
    it('must work without initial value', async () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipeAsync(
            input,
            reduce((c, i) => c + i)
        );
        expect(await output.first).to.eql(45);
    });
    it('must not generate more than one value', async () => {
        const input = [1, 2];
        const output = pipeAsync(
            input,
            reduce((a, c) => a + c)
        );
        const i = output[Symbol.asyncIterator]();
        const result = (await i.next()) && (await i.next());
        expect(result).to.eql({value: undefined, done: true});
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipeAsync(
            input,
            reduce((a, c, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return '';
            })
        );
        await _asyncValues(output);
        expect(arr).to.eql([1, 2, 3, 4, 5]);
    });
};
