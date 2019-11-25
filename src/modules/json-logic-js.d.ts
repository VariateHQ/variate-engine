declare module 'json-logic-js' {
    export function apply(logic: any, data: any): any;
    /* tslint:disable */
    export function add_operation(name: string, code: Function): void;
}

interface Options {
    debug: boolean,

}
