/**
 * Bucket number generator from 0 to 100
 * @returns {number}
 */
export const generateTrafficBucket = () => {
    return Math.floor((Math.random() * 100));
};

/**
 * Retrieve or generate main traffic bucket for visitor
 * @returns {number}
 */
const getMainTrafficBucket = () => {
    let bucket = parseInt(inBrowser && localStorage.getItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY), 10);

    if (!bucket) {
        bucket = this.generateTrafficBucket();
        inBrowser && localStorage.setItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY, bucket);
    }

    return bucket;
};
