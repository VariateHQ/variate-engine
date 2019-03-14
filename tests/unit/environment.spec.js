import Testing from '../../src';

describe('Environment', function () {
    it('Can set and access the environment', function () {
        const Test = new Testing({
            debug: false,
            config: {}
        });

        Test.setupEnvironment();

        expect(Test.env).toBeDefined();
        expect(Test.env).toEqual(jasmine.objectContaining({
            view: jasmine.objectContaining({
                path: jasmine.any(String),
                query: jasmine.any(Object),
            }),
            viewport: jasmine.objectContaining({
                mainBucket: jasmine.any(Number),
                doNotTrack: jasmine.any(Boolean),
                width: jasmine.any(Number),
                height: jasmine.any(Number),
                userAgent: jasmine.any(Boolean),
            }),
            targeting: jasmine.objectContaining({
                location: jasmine.falsy(),
                viewport: jasmine.objectContaining({
                    min: jasmine.any(Number),
                    max: jasmine.any(Number),
                }),
                platform: jasmine.falsy(),
            })
        }))
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
        expect(Test.env.view).toEqual(jasmine.objectContaining({
            href: 'bonzai',
            search: '?force=true'
        }));
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
        expect(Test.env.targeting).toEqual(jasmine.objectContaining({
            location: 'Canada',
            viewport: '<250',
            platform: 'ios',
        }));
    });
});
