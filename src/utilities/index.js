import * as env from './env';

const value = (properties, object, defaultValue) => {
    if(typeof properties === 'string') properties = properties.split('.');

    defaultValue = defaultValue || null;

    return properties.reduce((xs, x) => (xs && xs[x]) ? xs[x] : defaultValue, object);
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
