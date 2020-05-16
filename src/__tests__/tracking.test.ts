import Variate from '../../src';
import {EventTypes} from "../config/event-types";

describe('Global', function () {
    let variate: any;

    const runTests = () => {
        it('Cannot extract tracking arguments when empty', () => {
            expect(variate.extractTrackingArguments).toThrowError();
        });

        it('Can extract tracking arguments when provided separate arguments', () => {
            const event1 = variate.extractTrackingArguments(['Pageview', EventTypes.PAGEVIEW]);

            expect(event1).toBeDefined();
            expect(event1.name).toEqual('Pageview');
            expect(event1.type).toEqual(EventTypes.PAGEVIEW);
            expect(event1.value).toBeUndefined();

            const event2 = variate.extractTrackingArguments(['Click', EventTypes.CLICK, 5000]);

            expect(event2).toBeDefined();
            expect(event2.name).toEqual('Click');
            expect(event2.type).toEqual(EventTypes.CLICK);
            expect(event2.value).toEqual(5000);
        });

        it('Can extract tracking arguments when provided an object', () => {
            const event1 = variate.extractTrackingArguments([{
                name: 'Pageview',
                type: EventTypes.PAGEVIEW,
            }]);

            expect(event1).toBeDefined();
            expect(event1.name).toEqual('Pageview');
            expect(event1.type).toEqual(EventTypes.PAGEVIEW);
            expect(event1.value).toBeUndefined();

            const event2 = variate.extractTrackingArguments([{
                name: 'Click',
                type: EventTypes.CLICK,
                value: 5000
            }]);

            expect(event2).toBeDefined();
            expect(event2.name).toEqual('Click');
            expect(event2.type).toEqual(EventTypes.CLICK);
            expect(event2.value).toEqual(5000);
        });

        it('Does not track if tracking is disabled', async () => {
            variate.options = {
                tracking: {
                    enabled: false,
                },
            };
            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeFalsy();
        });

        it('Fails silently if reporter is not a function', async () => {
            variate.options = {
                tracking: {
                    default: false,
                    reporter: 'not-a-function',
                }
            };

            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBe(false);
        });

        it('Can track an event', async () => {
            variate.options = {
                tracking: {
                    default: false,
                    reporter: () => true,
                }
            };

            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBe(true);
        });

        it('Can track an event asynchronously', async () => {
            variate.options = {
                tracking: {
                    default: false,
                    reporter: () => {
                        return Promise.resolve(true);
                    },
                }
            };

            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBe(true);
        });

        it('Can fail gracefully if event fails', async () => {
            variate.options = {
                tracking: {
                    default: false,
                    reporter: () => false,
                }
            };
            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeFalsy();
        });

        it('Can fail gracefully if a reporter fails', async () => {
            variate.options = {
                tracking: {
                    default: false,
                    reporter: () => { throw new Error('') },
                }
            };
            const response = await variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeFalsy();
        });
    };

    describe('In debug mode', () => {
        beforeEach(() => {
            variate = new Variate({
                debug: true,
                pageview: false,
                config: {
                    siteId: 'test',
                    experiments: {},
                },
            });
            variate.initialize();

            expect(variate.isReady).toBe(true);
        });

        runTests();

    });
    describe('In production mode', () => {
        beforeEach(() => {
            variate = new Variate({
                debug: false,
                pageview: false,
                config: {
                    siteId: 'test',
                    experiments: {},
                },
            });
            variate.initialize();

            expect(variate.isReady).toBe(true);
        });

        runTests();

    });
});
