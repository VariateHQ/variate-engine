// @flow
import get from 'get-value';

export class Options {
    debug: number;
    _config: Object;

    constructor(options: Object) {
        this.debug = get(options, 'debug', false);
        this.config = get(options, 'config', { default: {} });
    }

    get config(): Object {
        return this._config;
    }

    set config(config: Object) {
        this._config = config;
    }
}
