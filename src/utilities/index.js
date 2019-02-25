import * as env from './env';

const value = (properties, object, defaultValue) => {
    defaultValue = defaultValue || null;

    if(!properties) return defaultValue;

    switch (typeof properties) {
        case 'number':
            return object[properties] || defaultValue;
            break;
        case 'string':
            properties = properties.split('.');
        default:
            return properties.reduce((xs, x) => (xs && xs[x]) ? xs[x] : defaultValue, object);
    }
};

const objectValue = (properties, object) => {
    return value(properties, object, {});
};

const arrayValue = (properties, array) => {
    return value(properties, array, []);
};

export default {
    value,
    objectValue,
    arrayValue,
    ...env
}
