import { name, styles, version } from '../config/console';

export default {
    show() {
        console.log(
            `%c ${name} %c ${version} `,
            styles.brand,
            styles.type,
        );
    },
};
