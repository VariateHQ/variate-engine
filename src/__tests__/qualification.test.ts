import Variate from '../../src';

describe('Qualification', function() {
    it("Can run qualification", function() {
        const variate = new Variate({
            debug: false,
            pageview: false,
            config: {
                siteId: '',
                experiments: {},
            }
        });

        variate.initialize();

        variate.qualify();

        expect(variate.isQualified).toBe(true);
    });
});
