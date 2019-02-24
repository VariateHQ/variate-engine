import Testing from '../../src';
import config from '../stubs/config.json';

describe('Experiments', function () {
    it('Can set and access the active experiments', function () {
        const Test = new Testing({
            debug: false,
            config
        });
        Test.initialize();

        expect(Test.experiments).toBeDefined();
    });
});
