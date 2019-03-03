import * as env from './env';
import * as access from './access';

if(env.inBrowser && console.warn) {
    const old = console.warn;
    console.warn = function() {
        old(...arguments);
    }
}

export default {
    ...access,
    ...env,
}
