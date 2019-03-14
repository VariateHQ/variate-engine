import Testing from '../../src';
import config from '../stubs/config.json';

describe('Config', function () {
    it('Can set and access the config', function () {
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

    it('Can parse relevant experiments from config', function () {
        const Test = new Testing({
            debug: false,
            config
        });
        Test.initialize({
            view: {
                path: '/',
                query: {}
            },
        });

        expect(Test.isReady).toBe(true);
        expect(Test.experiments).toBeDefined();
        expect(typeof Test.experiments).toBeDefined('array');
        expect(Test.experiments.length).toEqual(2);
        expect(Test.experiments[0]).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            name: jasmine.any(String),
            status: jasmine.any(String),
            targeting: jasmine.objectContaining({
                views: jasmine.objectContaining({
                    include: jasmine.any(Array),
                    exclude: jasmine.any(Array),
                }),
                segments: jasmine.objectContaining({
                    include: jasmine.any(Array),
                    exclude: jasmine.any(Array),
                }),
            }),
            variations: jasmine.any(Array),
        }));
        expect(Test.experiments[0]).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            name: jasmine.any(String),
            status: jasmine.any(String),
            targeting: jasmine.objectContaining({
                views: jasmine.objectContaining({
                    include: jasmine.any(Array),
                    exclude: jasmine.any(Array),
                }),
                segments: jasmine.objectContaining({
                    include: jasmine.any(Array),
                    exclude: jasmine.any(Array),
                }),
            }),
            variations: jasmine.any(Array),
        }));
    });

    it('Can parse relevant variations from config', function () {
        const Test = new Testing({
            debug: false,
            config
        });
        Test.initialize({
            view: {
                path: '/',
                query: {}
            },
        });

        expect(Test.isReady).toBe(true);
        expect(Test.variations).toBeDefined();
        expect(typeof Test.variations).toBeDefined('array');
        expect(Test.variations.length).toEqual(2);
        expect(Test.variations[0]).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            experiment_id: jasmine.any(Number),
            traffic_allocation: jasmine.objectContaining({
                min: jasmine.any(Number),
                max: jasmine.any(Number),
            }),
            components: jasmine.any(Object),
        }));
        expect(Test.variations[1]).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            experiment_id: jasmine.any(Number),
            traffic_allocation: jasmine.objectContaining({
                min: jasmine.any(Number),
                max: jasmine.any(Number),
            }),
            components: jasmine.any(Object),
        }))
    });

    it('Can parse relevant components from config', function () {
        const Test = new Testing({
            debug: false,
            config
        });
        Test.initialize({
            view: {
                path: '/',
                query: {}
            },
        });

        expect(Test.isReady).toBe(true);
        expect(Test.components).toBeDefined();
        expect(Test.components).toEqual(jasmine.objectContaining({
            Hero: jasmine.any(Object)
        }));
        expect(Test.components.Hero).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            attributes: jasmine.any(Object),
            experiments: jasmine.any(Array),
        }));
        expect(Test.components.Hero.attributes).toEqual(jasmine.objectContaining({
            backgroundImage: jasmine.any(String),
            headline: jasmine.any(String),
        }));
    });
});
