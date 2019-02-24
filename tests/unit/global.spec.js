import Testing from '../../src';

describe('Global', function() {
    it("Can initialize", function() {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.initialize();

        expect(Test.isReady).toBe(true);
    });
});
