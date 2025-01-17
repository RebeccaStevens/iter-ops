import {expect} from '../../header';
import {pipeSync, takeLast} from '../../../src';

export default () => {
    const input = [10, 20, 30, 40, 50];
    it('must emit the right number of values', () => {
        const output = pipeSync(input, takeLast(2));
        expect([...output]).to.eql([40, 50]);
    });
    it('must emit nothing for zero', () => {
        const output = pipeSync(input, takeLast(0));
        expect([...output]).to.eql([]);
    });
    it('must emit all when count is too big', () => {
        const output = pipeSync(input, takeLast(100));
        expect([...output]).to.eql(input);
    });
};
