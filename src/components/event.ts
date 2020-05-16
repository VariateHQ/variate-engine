import get from 'get-value';

export class Event {
    public siteId: string;
    public name: string;
    public type: string;
    public value: any;
    public context: object;

    constructor(event: any) {
        this.siteId = get(event, 'siteId', {
            default: ''
        });
        this.name = get(event, 'name', {
            default: 'Pageview'
        });
        this.type = get(event, 'type', {
            default: 'pageview'
        });
        this.value = get(event, 'value', {
            default: null,
        });
        this.context = get(event, 'context', {
            default: {},
        });
    }

    public toObject() {
        return {
            context: this.context,
            name: this.name,
            type: this.type,
            value: this.value,
        };
    }

    public toJson() {
        return JSON.stringify(this.toObject());
    }
}

export default Event;
