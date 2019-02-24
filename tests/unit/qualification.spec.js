import Testing from '../../src';

describe('Qualification', function() {
    it("Can run qualification", function() {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();
        Test.qualify();
        expect(Test.isQualified).toBe(true);
    });

    it("Can run qualification", function() {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();
        Test.qualify();
        expect(Test.isQualified).toBe(true);
    });
});
