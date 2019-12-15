import Event from './event';

export default class Tracking {
    public enabled: boolean = true;
    public default: boolean = true;
    public reporter?: (event: Event) => boolean;
}
