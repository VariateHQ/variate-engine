import Variate from '../';

describe('Qualification', function() {
    it("Can run qualification", function() {
        const variate = new Variate({
            debug: false,
            config: {}
        });

        variate.initialize();

        variate.qualify();

        expect(variate.isQualified).toBe(true);
    });
});
