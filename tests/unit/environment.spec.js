import Testing from '../../src';

describe('Environment', function () {
    it('Can set and access the environment', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
    });

    it('Environment contains view info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
        expect(Test.env.view).toBeDefined();
    });

    it('Environment can contain custom view info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            view: {
                href: 'bonzai',
                search: '?force=true'
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.view).toBeDefined();
        expect(Test.env.view.href).toBe('bonzai');
        expect(Test.env.view.search).toBe('?force=true');
    });

    it('Environment contains viewport info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
        expect(Test.env.viewport).toBeDefined();
        expect(Test.env.viewport.width).toBeDefined();
        expect(Test.env.viewport.height).toBeDefined();
        expect(Test.env.viewport.userAgent).toBeDefined();
        expect(Test.env.viewport.forcedQueryParams).toBeDefined();
        expect(Test.env.viewport.doNotTrack).toBeDefined();
    });

    it('Environment contains targeting info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
        expect(Test.env.targeting).toBeDefined();
        expect(Test.env.targeting.mainBucket).toBeDefined();
    });

    it('Environment can contain targeting visitor info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            targeting: {
                hello: 'world'
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.targeting).toBeDefined();
        expect(Test.env.targeting.mainBucket).toBeDefined();
        expect(Test.env.targeting.hello).toBeDefined();
        expect(Test.env.targeting.hello).toBe('world');
    });
});
