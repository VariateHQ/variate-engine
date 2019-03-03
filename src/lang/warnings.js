const brandName = 'Variate Engine';

const brandStyle = `background: #fdcb6e; color: white; font-weight: 500; border-radius: 3px 0 0 3px; padding: 1px 2px;`;
const typeStyle = 'background: #424242; color: white; font-weight: 400; padding: 1px 2px; border-radius: 0 3px 3px 0;';
const messageStyle = 'background: transparent; color: #424242;';

// Utilities
export const log = (message, ...params) => {
    console.warn(
        `%c ${brandName} %c WARNING %c ${message}`,
        brandStyle,
        typeStyle,
        messageStyle,
        ...params
    );
};
