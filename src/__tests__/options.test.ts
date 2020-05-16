import Variate from '../../src';

describe('Options', function() {
    it("Can set and access the options", function() {
        const config = {
            siteId: 'test',
            experiments: {},
        };
        const variate = new Variate({
            debug: false,
            pageview: false,
            config
        });
        expect(variate).toBeDefined();
        expect(variate.options).toEqual(expect.objectContaining({
            debug: expect.any(Boolean),
            config: expect.any(Object),
        }));
        expect(variate.options.debug).toBe(false);
        expect(variate.options.config).toBe(config);
    });
});
