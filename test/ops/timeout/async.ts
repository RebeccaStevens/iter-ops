import {_asyncValues, expect} from '../../header';
import {pipeAsync, delay, timeout} from '../../../src';

export default () => {
    it('must end iteration after timeout', async () => {
        const i = pipeAsync([1, 2, 3], delay(20), timeout(50));
        expect(await _asyncValues(i)).to.eql([1, 2]);
    });
    it('must invoke callback on timeout', async () => {
        let count;
        const i = pipeAsync(
            [1, 2, 3],
            delay(10),
            timeout(19, (c) => {
                count = c;
            })
        );
        await _asyncValues(i);
        expect(count).to.eql(2);
    });
    it('must not invoke callback without timeout', async () => {
        let invoked = false;
        const i = pipeAsync(
            [1, 2, 3],
            timeout(10, () => {
                invoked = true;
            })
        );
        await _asyncValues(i); // iterate
        expect(invoked).to.be.false; // no callback
    });
    it('must deactivate on negative timeouts', async () => {
        const i = pipeAsync([1, 2, 3], timeout(-1));
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
};
