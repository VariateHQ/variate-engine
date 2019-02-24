import Testing from '../../src';

describe('Options', function() {
    it("Can set and access the options", function() {
        const config = {
            hello: 'world'
        };
        const Test = new Testing({
            debug: false,
            config
        });
        expect(Test).toBeDefined();
        expect(Test.options).toEqual(jasmine.objectContaining({
            debug: jasmine.any(Boolean),
            config: jasmine.any(Object),
        }));
        expect(Test.options.debug).toBe(false);
        expect(Test.options.config).toBe(config);
    });
});
