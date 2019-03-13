import { name, styles } from '../config/console';

// Setup
export const SETUP_OPTIONS = `[SETUP] Setting up options ✅`;
export const SETUP_ENVIRONMENT = `[SETUP] Setting up environment ✅`;

// Query Params
export const QUERY_PARAMS = `[QUERY PARAMS] Query params detected ✅️`;

// Experiments
export const LOADING_EXPERIMENTS = `[LOADING] Loading relevant experiments ✅`;

// Targeting
export const TARGETING_VIEW_QUALIFIED = `[TARGETING|VIEW] Qualified 👍`;
export const TARGETING_VIEW_NOT_QUALIFIED = `[TARGETING|VIEW] Not qualified 👎`;

export const TARGETING_SEGMENT_QUALIFIED = `[TARGETING|SEGMENT] Qualified 👍`;
export const TARGETING_SEGMENT_NOT_QUALIFIED = `[TARGETING|SEGMENT] Not qualified 👎`;

// Utilities
export const log = (message, ...params) => {
    console.log(
        `%c ${name} %c DEBUG %c ${message}`,
        styles.brand,
        styles.type,
        styles.message,
        ...params
    );
};

export function group(message, ...params) {
    console.groupCollapsed(
        `%c ${name} %c DEBUG %c ${message}`,
        styles.brand,
        styles.type,
        styles.message,
        ...params
    );
}
