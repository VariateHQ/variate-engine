import get from 'get-value';
import Config from './config';
import Tracking from './tracking';

export default class Options {
    public debug: boolean;
    public pageview: boolean;
    public tracking: Tracking;
    public config: Config;

    constructor(options: Partial<Options>) {
        this.debug = get(options, 'debug', {
            default: false,
        });
        this.pageview = get(options, 'pageview', {
            default: true,
        });
        this.tracking = new Tracking(get(options, 'tracking', {
            default: {},
        }));
        this.config = get(options, 'config', {
            default: {},
        });
    }
}
