import { name, version, styles } from '../config/console';

export default {
    show: function() {
        console.log(
            `%c ${name} %c ${version} `,
            styles.brand,
            styles.type
        );
    },
}
