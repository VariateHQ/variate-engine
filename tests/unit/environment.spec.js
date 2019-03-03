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
        expect(Test.env.viewport.mainBucket).toBeDefined();
        expect(Test.env.viewport.doNotTrack).toBeDefined();
        expect(Test.env.viewport.width).toBeDefined();
        expect(Test.env.viewport.height).toBeDefined();
        expect(Test.env.viewport.userAgent).toBeDefined();
    });

    it('Environment can contain custom targeting info', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });
        Test.setupEnvironment({
            targeting: {
                location: 'Canada',
                viewport: '<250',
                platform: 'ios'
            }
        });

        expect(Test.env).toBeDefined();
        expect(Test.env.targeting).toBeDefined();
        expect(Test.env.targeting.location).toBeDefined();
        expect(Test.env.targeting.location).toBe('Canada');
        expect(Test.env.targeting.viewport).toBeDefined();
        expect(Test.env.targeting.viewport).toBe('<250');
        expect(Test.env.targeting.platform).toBeDefined();
        expect(Test.env.targeting.platform).toBe('ios');
    });
});
