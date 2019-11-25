import Variate from '../';
import config from './stubs/config.json';

describe('Experiments', function () {
    it('Can set and access the active experiments', function () {
        const variate = new Variate({
            debug: false,
            config
        });
        variate.initialize();

        expect(variate.experiments).toBeDefined();
    });
});
