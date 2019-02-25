// Browser environment sniffing
import _ from './index';

export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();

// Browsers
export const isIE = UA && /msie|trident/.test(UA);
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isAndroid = (UA && UA.indexOf('android') > 0);
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
export const isPhantomJS = UA && /phantomjs/.test(UA);
export const isFF = UA && UA.match(/firefox\/(\d+)/);

export const doNotTrack = () => {
    if(inBrowser) {
        // Firefox override
        if (window.navigator.doNotTrack == 'unspecified') {
            return false;
        }

        return window.navigator.doNotTrack || false;
    }

    return false;
};

export const width = () => {
    return inBrowser ? window.innerWidth : -1;
};

export const height = () => {
    return inBrowser ? window.innerWidth : -1;
};
