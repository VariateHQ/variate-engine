import Variate from '../../src';

describe('Environment', function () {
    let variate: any;

    const tests = () => {
        it('Can set and access the environment', () => {
            expect(variate.env).toEqual(expect.objectContaining({
                view: expect.objectContaining({
                    path: expect.any(String),
                    query: expect.any(Object),
                }),
                viewport: expect.objectContaining({
                    mainBucket: expect.any(Number),
                    doNotTrack: expect.any(Boolean),
                    width: expect.any(Number),
                    height: expect.any(Number),
                    userAgent: expect.any(String),
                }),
                targeting: expect.any(Object),
            }))
        });

        it('Environment can support Firefox edge case for do not track', () => {
            Object.defineProperty(window.navigator, 'doNotTrack', {
                value: "unspecified",
            });

            variate.initialize();

            expect(variate.env).toEqual(expect.objectContaining({
                view: expect.objectContaining({
                    path: expect.any(String),
                    query: expect.any(Object),
                }),
                viewport: expect.objectContaining({
                    mainBucket: expect.any(Number),
                    doNotTrack: expect.any(Boolean),
                    width: expect.any(Number),
                    height: expect.any(Number),
                    userAgent: expect.any(String),
                }),
                targeting: expect.any(Object),
            }))
        });

        it('Environment can contain custom view info', () => {
            variate.env = {
                view: {
                    href: 'bonzai',
                    search: '?force=true'
                }
            };

            expect(variate.env).toBeDefined();
            expect(variate.env.view).toBeDefined();
            expect(variate.env.view).toEqual(expect.objectContaining({
                href: 'bonzai',
                search: '?force=true'
            }));
        });

        it('Environment can contain custom targeting info', () => {
            variate.env = {
                targeting: {
                    location: 'Canada',
                    viewport: '<250',
                    platform: 'ios'
                }
            };

            expect(variate.env).toBeDefined();
            expect(variate.env.targeting).toBeDefined();
            expect(variate.env.targeting).toEqual(expect.objectContaining({
                location: 'Canada',
                viewport: '<250',
                platform: 'ios',
            }));
        });

        it('Can force query params', () => {

            expect(variate.shouldForceQueryParams()).toBeFalsy();

            variate.env = {
                view: {
                    query: {
                        force: true
                    },
                },
            };

            expect(variate.shouldForceQueryParams()).toBeTruthy();
        });
    };

    describe('In debug mode', () => {
        beforeEach(() => {
            variate = new Variate({
                debug: true,
                config: {}
            });

            variate.initialize();

            expect(variate.env).toBeDefined();
        });

        tests();
    });

    describe('In production mode', () => {
        beforeEach(() => {
            variate = new Variate({
                debug: false,
                config: {}
            });

            variate.initialize();

            expect(variate.env).toBeDefined();
        });

        tests();
    });
});
