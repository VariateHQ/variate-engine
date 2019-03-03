const brandName = 'Variate Engine';

const brandStyle = `background: #e17055; color: white; font-weight: 500; border-radius: 3px 0 0 3px; padding: 1px 2px;`;
const typeStyle = 'background: #424242; color: white; font-weight: 400; padding: 1px 2px; border-radius: 0 3px 3px 0;';
const messageStyle = 'background: transparent; color: #424242';

export const IS_READY_TYPE_ERROR = `The isReady property requires a boolean.`;
export const IS_QUALIFIED_TYPE_ERROR = `The isQualified property requires a boolean.`;

// Utilities
export const log = (message, ...params) => {
    console.error(
        `%c ${brandName} %c ERROR %c ${message}`,
        brandStyle,
        typeStyle,
        messageStyle,
        ...params
    );
};
