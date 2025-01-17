import {_asyncValues, expect} from '../../header';
import {pipeAsync, takeLast} from '../../../src';

export default () => {
    const input = [10, 20, 30, 40, 50];
    it('must emit the right number of values', async () => {
        const output = pipeAsync(input, takeLast(2));
        expect(await _asyncValues(output)).to.eql([40, 50]);
    });
    it('must emit nothing for zero', async () => {
        const output = pipeAsync(input, takeLast(0));
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must emit all when count is too big', async () => {
        const output = pipeAsync(input, takeLast(100));
        expect(await _asyncValues(output)).to.eql(input);
    });
};
