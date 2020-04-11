import Variate from '../../src';
import config from './stubs/config.json';

describe('Config', function () {
    let variate: Variate;

    beforeEach(() => {
        variate = new Variate({
            debug: false,
            pageview: false,
            config
        });
        variate.initialize({
            view: {
                path: '/',
                query: {}
            },
            targeting: {
                country: 'Canada',
                state: 'BC'
            }
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
        expect(variate.experiments.length).toEqual(1);
        expect(variate.experiments[0]).toEqual(expect.objectContaining({
            id: expect.any(String),
            siteId: expect.any(String),
            name: expect.any(String),
            environment: expect.any(String),
            manualQualification: expect.any(Boolean),
            targeting: expect.objectContaining({
                views: expect.objectContaining({
                    include: expect.any(Array),
                    exclude: expect.any(Array),
                }),
                segments: expect.any(Object),
            }),
            variations: expect.any(Array),
        }));
    });

    it('Can parse relevant variations from config', () => {
        expect(variate.isReady).toBe(true);
        expect(variate.variations).toBeDefined();
        expect(typeof variate.variations).toBeDefined();
        expect(variate.variations.length).toEqual(1);
        expect(variate.variations[0]).toEqual(expect.objectContaining({
            id: expect.any(String),
            experimentId: expect.any(String),
            siteId: expect.any(String),
            trafficAllocation: expect.objectContaining({
                min: expect.any(Number),
                max: expect.any(Number),
            }),
            components: expect.any(Object),
        }));
    });

    it('Can parse relevant components from config', () => {
        expect(variate.isReady).toBe(true);
        expect(variate.components).toBeDefined();
        expect(variate.components).toEqual(expect.objectContaining({
            Hero: expect.any(Object)
        }));
        expect(variate.components.Hero).toEqual(expect.objectContaining({
            id: expect.any(String),
            variationId: expect.any(String),
            experimentId: expect.any(String),
            siteId: expect.any(String),
            bucket: expect.any(Number),
            variables: expect.any(Object),
        }));
        expect(variate.components.Hero.variables).toEqual(expect.objectContaining({
            backgroundImage: expect.any(String)
        }));
    });
});
