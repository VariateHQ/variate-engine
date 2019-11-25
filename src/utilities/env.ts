// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();

// Browsers
export const isIE: boolean = UA && /msie|trident/.test(UA) || false;
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
export const isEdge = UA && UA.indexOf('edge/') > 0;
export const isAndroid = (UA && UA.indexOf('android') > 0);
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
/* istanbul ignore next */
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
export const isPhantomJS = UA && /phantomjs/.test(UA);
export const isFF = UA && UA.match(/firefox\/(\d+)/);

export const doNotTrack = (): boolean => {
    if (inBrowser) {
        // Firefox override
        if (window.navigator.doNotTrack === 'unspecified') {
            return false;
        }

        return (/true/i).test(window.navigator.doNotTrack || '') || false;
    }

    return false;
};

export const href = (): string => {
    return inBrowser ? window.location.href : '';
};

export const search = (): string => {
    return inBrowser ? window.location.search : '';
};

export const width = (): number => {
    return inBrowser ? window.innerWidth : -1;
};

export const height = (): number => {
    return inBrowser ? window.innerWidth : -1;
};

export default {
    UA,
    doNotTrack,
    height,
    href,
    inBrowser,
    isAndroid,
    isChrome,
    isFF,
    isIE,
    isIE9,
    isIOS,
    isPhantomJS,
    search,
    width,
};
