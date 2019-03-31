import { name, styles } from '../config/console';

export const IS_READY_TYPE_ERROR = `The isReady property requires a boolean.`;
export const IS_QUALIFIED_TYPE_ERROR = `The isQualified property requires a boolean.`;
export const REQUIRED_PARAMETERS = `Parameters are required for the method %s`;

// Utilities
export const log = (message, ...params) => {
    console.error(
        `%c ${name} %c ERROR %c ${message}`,
        styles.error,
        styles.type,
        styles.message,
        ...params
    );
};
