/**
 * @jest-environment node
 */
import Variate from '../';

it('Environment can degrade gracefully if window is undefined', () => {
    const variate = new Variate({
        debug: false,
        pageview: false,
        config: {}
    });

    variate.initialize();

    expect(variate.env).toEqual(expect.objectContaining({
        view: expect.objectContaining({
            path: expect.any(String),
            url: expect.any(String),
            query: expect.any(Object),
        }),
        targeting: expect.objectContaining({
            doNotTrack: expect.any(Boolean),
            width: expect.any(Number),
            height: expect.any(Number),
            userAgent: expect.any(Boolean),
        }),
    }))
});
