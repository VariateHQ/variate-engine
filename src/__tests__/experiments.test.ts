import Variate from '../../src';
import config from './stubs/config.json';

describe('Experiments', function () {
    beforeEach(() => {
        console.log(config);
    });
    it('Can set and access the active experiments', function () {
        const variate = new Variate({
            debug: false,
            pageview: false,
            config
        });
        variate.initialize();

        expect(variate.experiments).toBeDefined();
    });
});
