import Variate from '../../src';
import config from './stubs/config.json';

describe('Config', function () {
    let variate: Variate;

    beforeEach(() => {
        variate = new Variate({
            debug: false,
            config
        });
        variate.initialize({
            view: {
                path: '/',
                query: {}
            },
        });
        expect(variate).toBeDefined();
    });

    it('Can set and access the config', () => {
        expect(variate.options).toEqual(expect.objectContaining({
            debug: expect.any(Boolean),
            config: expect.any(Object),
        }));
        expect(variate.options.debug).toBe(false);
        expect(variate.options.config).toBe(config);
    });

    it('Can parse relevant experiments from config', function () {
        expect(variate.isReady).toBe(true);
        expect(variate.experiments).toBeDefined();
        expect(typeof variate.experiments).toBeDefined();
        expect(variate.experiments.length).toEqual(2);
        expect(variate.experiments[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            status: expect.any(String),
            targeting: expect.objectContaining({
                views: expect.objectContaining({
                    include: expect.any(Array),
                    exclude: expect.any(Array),
                }),
                segments: expect.objectContaining({
                    include: expect.any(Array),
                    exclude: expect.any(Array),
                }),
            }),
            variations: expect.any(Array),
        }));
        expect(variate.experiments[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            status: expect.any(String),
            targeting: expect.objectContaining({
                views: expect.objectContaining({
                    include: expect.any(Array),
                    exclude: expect.any(Array),
                }),
                segments: expect.objectContaining({
                    include: expect.any(Array),
                    exclude: expect.any(Array),
                }),
            }),
            variations: expect.any(Array),
        }));
    });

    it('Can parse relevant variations from config', () => {
        expect(variate.isReady).toBe(true);
        expect(variate.variations).toBeDefined();
        expect(typeof variate.variations).toBeDefined();
        expect(variate.variations.length).toEqual(2);
        expect(variate.variations[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            experimentId: expect.any(Number),
            trafficAllocation: expect.objectContaining({
                min: expect.any(Number),
                max: expect.any(Number),
            }),
            components: expect.any(Object),
        }));
        expect(variate.variations[1]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            experimentId: expect.any(Number),
            trafficAllocation: expect.objectContaining({
                min: expect.any(Number),
                max: expect.any(Number),
            }),
            components: expect.any(Object),
        }))
    });

    it('Can parse relevant components from config', () => {
        expect(variate.isReady).toBe(true);
        expect(variate.components).toBeDefined();
        expect(variate.components).toEqual(expect.objectContaining({
            Hero: expect.any(Object)
        }));
        expect(variate.components.Hero).toEqual(expect.objectContaining({
            id: expect.any(Number),
            variables: expect.any(Object),
            experiments: expect.any(Array),
        }));
        expect(variate.components.Hero.variables).toEqual(expect.objectContaining({
            backgroundImage: expect.any(String),
            headline: expect.any(String),
        }));
    });
});
