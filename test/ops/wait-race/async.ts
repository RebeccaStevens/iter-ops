import {_asyncValues, expect} from '../../header';
import {pipeAsync, map, waitRace} from '../../../src';

export default () => {
    it('must resolve all promises', async () => {
        const i = pipeAsync(
            [1, 2, 3, 4],
            map((a) => Promise.resolve(a)),
            waitRace(2)
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve all simple values', async () => {
        const i = pipeAsync([1, 2, 3, 4], waitRace(2));
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve combinations of promises and simple values', async () => {
        const i = pipeAsync(
            [1, Promise.resolve(2), 3, Promise.resolve(4)],
            waitRace(2)
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must handle invalid size of cache', async () => {
        const i = pipeAsync([1, 2, 3, 4], waitRace(-1));
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must reject when a value rejects', async () => {
        const i = pipeAsync([1, Promise.reject(2) as any, 3], waitRace(1));
        let err;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err).to.eql(2);
    });
    it('must start resolving without delay', () => {
        const input = [1, 2, 3, 4, 5];
        // const i =
    });
};
