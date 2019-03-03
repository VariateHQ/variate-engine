const brandName = 'Variate Engine';

const brandStyle = `background: rgba(143, 127, 224, 1); color: white; font-weight: 500; border-radius: 3px 0 0 3px; padding: 1px 2px;`;
const typeStyle = 'background: #424242; color: white; font-weight: 400; padding: 1px 2px; border-radius: 0 3px 3px 0;';
const messageStyle = 'background: transparent; color: #424242; font-weight: 400;';

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
    console.debug(
        `%c ${brandName} %c DEBUG %c ${message}`,
        brandStyle,
        typeStyle,
        messageStyle,
        ...params
    );
};

export function group(message, ...params) {
    console.groupCollapsed(
        `%c ${brandName} %c DEBUG %c ${message}`,
        brandStyle,
        typeStyle,
        messageStyle,
        ...params
    );
}
