const prefix = '[AB Test debug]';

// Setup
export const SETUP_OPTIONS = `${prefix}[SETUP] Setting up options`;
export const SETUP_ENVIRONMENT = `${prefix}[SETUP] Setting up environment`;

// Query Params
export const QUERY_PARAMS = `${prefix}[FORCE] Query Params detected`;

// Experiments
export const LOADING_EXPERIMENTS = `${prefix}[LOADING] Loading relevant experiments`;

// Components
export const LOAD_COMPONENT_VARIATION = `${prefix}[Component: %s] Variation %s`;
export const LOAD_COMPONENT_BUCKET = `${prefix}[Component: %s] Bucket: %s`;

// Targeting
export const TARGETING_VIEW_CHECK = `${prefix}[TARGETING] Checking view targeting`;
export const TARGETING_AUDIENCE_CHECK = `${prefix}[TARGETING] Checking audience targeting`;

export const TARGETING_VIEW_QUALIFIED = `${prefix}[TARGETING][URL] Qualified`;
export const TARGETING_VIEW_NOT_QUALIFIED = `${prefix}[TARGETING][URL] NOT Qualified`;
