import Event from './event';
import get from 'get-value';

export default class Tracking {
    public enabled?: boolean = true;
    public default?: boolean = true;
    public reporter?: (event: Event) => boolean;

    constructor(tracking: Partial<Tracking>) {
        this.enabled = get(tracking, 'enabled', {
            default: true,
        });
        this.default = get(tracking, 'default', {
            default: true,
        });
        this.reporter = get(tracking, 'reporter', {
            default: () => true,
        })
    }
}
