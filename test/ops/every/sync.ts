import {expect} from '../../header';
import {pipeSync, every} from '../../../src';

export default () => {
    it('must signal when all passed', () => {
        const i = pipeSync(
            [1, 2, 3],
            every((a) => a < 5)
        );
        expect([...i]).to.eql([true]);
    });
    it('must work without full match', () => {
        const i = pipeSync(
            [1, 2, 3],
            every((a) => a > 5)
        );
        expect([...i]).to.eql([false]);
    });
};
