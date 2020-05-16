import Variate from '../../src';

describe('Global', function() {
    it("Can initialize", function() {
        const variate = new Variate({
            debug: false,
            pageview: false,
            config: {
                siteId: '',
                experiments: {},
            }
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can initialize in debug mode", function() {
        const variate = new Variate({
            debug: true,
            pageview: false,
            config: {
                siteId: '',
                experiments: {},
            }
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can check when ready", function() {
        const variate = new Variate({
            debug: true,
            pageview: false,
            config: {
                siteId: '',
                experiments: {},
            }
        });

        expect(variate.isReady).toBe(false);

        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can set the config", function() {
        const variate = new Variate({
            debug: false,
            pageview: false,
            config: {
                siteId: '',
                experiments: {},
            }
        });
        variate.initialize();

        variate.config = {
            siteId: 'test',
            experiments: {},
        };

        expect(variate.config.siteId).toBe('test');
    });
});
