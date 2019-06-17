// @flow
import get from 'get-value';

export class Options {
    // Activate debug mode
    debug: boolean;

    // Activate tracking
    tracking: boolean;

    // Allow for a custom tracking reporter
    reporter: function;

    // Activate automatic pageview tracking
    pageview: boolean;

    _config: Object;

    constructor(options: Object) {
        this.debug = get(options, 'debug', false);
        this.tracking = get(options, 'tracking', true);
        this.reporter = get(options, 'reporter', null);
        this.pageview = get(options, 'pageview', true);
        this.config = get(options, 'config', { default: {} });
    }

    get config(): Object {
        return this._config;
    }

    set config(config: Object) {
        this._config = config;
    }
}

export default Options;
