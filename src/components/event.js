// @flow
import get from 'get-value';

export class Event {
    _name: String;
    _type: String;
    _value: String|Object|Number|Boolean;
    _context: Object;

    constructor(event: Object) {
        this.name = get(event, 'name', 'Pageview');
        this.type = get(event, 'type', 'pageview');
        this.value = get(event, 'value', null);
        this.context = get(event, 'context', {});
    }

    get name(): String {
        return this._name;
    }

    set name(name: String) {
        this._name = name;
    }

    get type(): String {
        return this._type;
    }

    set type(type: String) {
        this._type = type;
    }

    get value(): String|Object|Number|Boolean {
        return this._value;
    }

    set value(value: String|Object|Number|Boolean) {
        this._value = value;
    }

    get context(): Object {
        return this._context;
    }

    set context(context: Object) {
        this._context = context;
    }

    toObject(){
        return {
            name: this.name,
            type: this.type,
            value: this.value,
            // context: this.context,
        }
    }

    toJson(){
        return JSON.stringify(this.toObject());
    }
}

export default Event;
