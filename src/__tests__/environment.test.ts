import Variate from '../../src';

describe('Environment', function () {
    let variate: any;

    const tests = () => {
        it('Can set the environment with defaults', () => {
            expect(variate.env).toEqual(expect.objectContaining({
                view: expect.objectContaining({
                    path: expect.any(String),
                    query: expect.any(Object),
                }),
                viewport: expect.objectContaining({
                    doNotTrack: expect.any(Boolean),
                    width: expect.any(Number),
                    height: expect.any(Number),
                    userAgent: expect.any(String),
                }),
                targeting: expect.any(Object),
            }))
        });

        it('Can set and access a custom environment', () => {
            variate.initialize({
                view: {
                    path: '/',
                    query: {
                        force: true
                    }
                }
            });
            expect(variate.env).toEqual(expect.objectContaining({
                view: expect.objectContaining({
                    path: expect.any(String),
                    query: expect.any(Object),
                }),
                viewport: expect.objectContaining({
                    doNotTrack: expect.any(Boolean),
                    width: expect.any(Number),
                    height: expect.any(Number),
                    userAgent: expect.any(String),
                }),
                targeting: expect.any(Object),
            }));
            expect(variate.env.view.path).toBeDefined();
            expect(variate.env.view.path).toEqual('/');
            expect(variate.env.view.query.force).toBeDefined();
            expect(variate.env.view.query.force).toBeTruthy();
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
                    doNotTrack: expect.any(Boolean),
                    width: expect.any(Number),
                    height: expect.any(Number),
                    userAgent: expect.any(String),
                }),
                targeting: expect.any(Object),
            }))
        });

        it('Environment cannot contain custom view info', () => {
            variate.env = {
                view: {
                    href: 'bonzai',
                    search: '?force=true'
                }
            };

            expect(variate.env).toBeDefined();
            expect(variate.env.view).toBeDefined();
            expect(variate.env.view.href).toBeUndefined();
            expect(variate.env.view.search).toBeUndefined();
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
