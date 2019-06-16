// @flow
import get from 'get-value';

export class Options {
    debug: number;
    tracking: boolean;
    reporter: function;
    _config: Object;

    constructor(options: Object) {
        this.debug = get(options, 'debug', false);
        this.tracking = get(options, 'tracking', true);
        this.reporter = get(options, 'reporter', null);
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
