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
    });

    it('Environment can contain custom viewport info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            viewport: {
                hello: 'world'
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.viewport).toBeDefined();
        expect(Test.env.viewport.hello).toBeDefined();
        expect(Test.env.viewport.hello).toBe('world');
    });

    it('Environment contains visitor info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
        expect(Test.env.visitor).toBeDefined();
        expect(Test.env.visitor.mainBucket).toBeDefined();
        expect(Test.env.visitor.forcedQueryParams).toBeDefined();
        expect(Test.env.visitor.doNotTrack).toBeDefined();
    });

    it('Environment can contain custom visitor info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            visitor: {
                hello: 'world'
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.visitor).toBeDefined();
        expect(Test.env.visitor.hello).toBeDefined();
        expect(Test.env.visitor.hello).toBe('world');
    });

    it('Environment can contain other custom info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            custom: {
                hello: 'world',
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.custom).toBeDefined();
        expect(Test.env.custom.hello).toBeDefined();
        expect(Test.env.custom.hello).toBe('world');
    });
});
