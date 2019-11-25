import Variate from '../';

describe('Global', function() {
    it("Can initialize", function() {
        const variate = new Variate({
            debug: false,
            config: {}
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can initialize in debug mode", function() {
        const variate = new Variate({
            debug: true,
            config: {}
        });
        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

    it("Can check when ready", function() {
        const variate = new Variate({
            debug: true,
            config: {}
        });

        expect(variate.isReady).toBe(false);

        variate.initialize();

        expect(variate.isReady).toBe(true);
    });

});
