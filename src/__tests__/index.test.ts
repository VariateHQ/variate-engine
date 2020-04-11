import Variate from '../';

describe('Global', function() {
    it("Can initialize", function() {
        const variate = new Variate({
            debug: false,
            pageview: false,
            config: {}
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can initialize in debug mode", function() {
        const variate = new Variate({
            debug: true,
            pageview: false,
            config: {}
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can check when ready", function() {
        const variate = new Variate({
            debug: true,
            pageview: false,
            config: {}
        });

        expect(variate.isReady).toBe(false);

        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

});
