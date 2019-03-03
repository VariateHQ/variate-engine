import { name, styles } from '../config/console';

// Utilities
export const log = (message, ...params) => {
    console.warn(
        `%c ${name} %c WARNING %c ${message}`,
        styles.warning,
        styles.type,
        styles.message,
        ...params
    );
};
