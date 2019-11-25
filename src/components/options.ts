import get from 'get-value';
import Config from './config';
import Event from './event';

export class Options {
    public debug?: boolean;
    public tracking?: boolean;
    public reporter?: (event: Event) => boolean;
    public pageview?: boolean;
    public config: Config;

    constructor(options: Partial<Options>) {
        this.debug = get(options, 'debug', {
            default: false,
        });
        this.tracking = get(options, 'tracking', {
            default: true,
        });
        this.reporter = get(options, 'reporter', {
            default: null,
        });
        this.pageview = get(options, 'pageview', {
            default: true,
        });
        this.config = get(options, 'config', {
            default: {},
        });
    }
}

export default Options;
