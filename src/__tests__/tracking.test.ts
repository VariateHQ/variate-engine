import Variate from '../';
import Event from "../components/event";
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

        it('Does not track if tracking is disabled', () => {
            variate.options = {
                tracking: false,
                reporter: () => true,
            };
            const response = variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeFalsy();
        });

        it('Throws an error if reporter is not a function', () => {
            variate.options = {
                reporter: 'nope',
            };
            expect(() => variate.track('Pageview', EventTypes.PAGEVIEW)).toThrowError();
        });

        it('Can track an event', () => {
            variate.options = {
                reporter: () => true,
            };
            const response = variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeTruthy();
        });

        it('Can fail gracefully if event fails', () => {
            variate.options = {
                reporter: () => false,
            };
            const response = variate.track('Pageview', EventTypes.PAGEVIEW);
            expect(response).toBeFalsy();
        });
    };

    describe('In debug mode', () => {
        beforeEach(() => {
            variate = new Variate({
                debug: true,
                config: {},
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
                config: {},
            });
            variate.initialize();

            expect(variate.isReady).toBe(true);
        });

        runTests();

    });
});
