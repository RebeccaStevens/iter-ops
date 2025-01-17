import {_asyncValues, expect} from '../../header';
import {pipeAsync, start} from '../../../src';

export default () => {
    it('must trigger on condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipeAsync(
            input,
            start((a) => a > 3)
        );
        expect(await _asyncValues(output)).to.eql([4, 5]);
    });
    it('must trigger on async condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipeAsync(
            input,
            start(async (a) => a > 3)
        );
        expect(await _asyncValues(output)).to.eql([4, 5]);
    });
    it('must support non-starters', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipeAsync(
            input,
            start((a) => a > 5)
        );
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must support async non-starters', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipeAsync(
            input,
            start(async (a) => a > 5)
        );
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipeAsync(
            input,
            start((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return true;
            })
        );
        expect(await _asyncValues(output)).to.eql(input.split(''));
        expect(arr).to.eql([1]);
    });
};
