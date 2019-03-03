/**
 * Return a property anywhere in an object/array, choosen default value otherwise
 * @param property
 * @param object
 * @param defaultValue
 * @returns {*}
 */
export const value = (property, object, defaultValue) => {
    defaultValue = defaultValue || null;

    if(!property) return defaultValue;

    switch (typeof property) {
        case 'number':
            return object[property] || defaultValue;
            break;
        case 'string':
            property = property.split('.');
        default:
            return property.reduce((xs, x) => (xs && xs[x]) ? xs[x] : defaultValue, object);
    }
};

/**
 * Return a property if it exists or an empty object
 * @param property
 * @param object
 * @returns {*}
 */
export const objectValue = (property, object) => {
    return value(property, object, {});
};

/**
 * Return a property if it exists or an empty array
 * @param property
 * @param array
 * @returns {*}
 */
export const arrayValue = (property, array) => {
    return value(property, array, []);
};
