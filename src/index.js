// @flow

import deepmerge from 'deepmerge';
import get from 'get-value';
import version from './lang/version';
import * as debug from './lang/debug';
import * as errors from './lang/errors';
import env from './utilities/env';

const LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY = 'testing-tool-main-bucket';
const LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY = 'testing-tool-buckets';

class Testing {
    _options: Object;
    _config: Object;
    _env: Object;
    _experiments: Array<Object>;
    _isReady: boolean;
    _isQualified: boolean;

    constructor(options: Object) {
        options.debug && version.show();
        this.setupOptions(options);
    }

    /**
     * Get testing options
     * @returns {object}
     */
    get options() {
        return this._options;
    }

    /**
     * Set testing options
     * @param options
     */
    set options(options: Object) {
        this._options = Object.assign({}, this._options, options);
    }

    /**
     * Get testing configuration
     * @returns {object}
     */
    get config() {
        return this._options.config;
    }

    /**
     * Set testing configuration
     * @param config
     */
    set config(config: Object) {
        this._options.config = config;
    }

    /**
     * Get status of the testing tool
     * @returns {boolean}
     */
    get isReady() {
        return this._isReady;
    }

    /**
     * Set status of the testing tool
     * @param value
     */
    set isReady(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new TypeError(errors.IS_READY_TYPE_ERROR);
        }
        this._isReady = value;
    }

    /**
     * Get qualification status for visitor
     * @returns {boolean}
     */
    get isQualified(): boolean {
        return this._isQualified;
    }

    /**
     * Set qualification status for visitor
     * @param value
     */
    set isQualified(value: boolean): void {
        if (typeof value !== 'boolean') {
            throw new TypeError(errors.IS_QUALIFIED_TYPE_ERROR);
        }
        this._isQualified = value;
    }

    /**
     * Get testing environment
     * @returns {object}
     */
    get env(): Object {
        return this._env;
    }

    /**
     * Set testing environment
     * @param value
     */
    set env(value: Object): void {
        this._env = Object.assign({}, this._env, value);
    }

    /**
     * Get active experiments
     * @returns {Array}
     */
    get experiments() {
        return this._experiments || [];
    }

    /**
     * Set active experiments
     * @param value
     */
    set experiments(value: Array<Object>) {
        this._experiments = value || [];
    }

    /**
     * Get active experiments
     * @returns {Array}
     */
    get variations() {
        return this.experiments.map((experiment) => experiment.variations).flat();
    }

    /**
     * Get all components
     * @returns {Array}
     */
    get components() {
        const components = deepmerge.all(this.variations.flatMap(this.extractVariationComponents.bind(this)));

        return Object.assign({}, components);
    }

    /**
     * Extract variation components
     * @param variation
     * @returns {array}
     */
    extractVariationComponents(variation: Object) {
        const bucket = this.getExperimentBucket({ id: variation.experiment_id });

        for (let component: Object of Object.entries(variation.components)) {
            component.shift();
            component[0].experiments = [];
            component[0].experiments.push({
                experiment: variation.experiment_id,
                variation: variation.id,
                bucket: bucket,
                attributes: component[0].attributes
            });
        }

        return variation.components;
    }

    /**
     * Bucket number generator from 0 to 100
     * @returns {number}
     */
    static generateTrafficBucket() {
        return Math.round(Math.random() * 100);
    }

    /**
     * Get query parameters from window.Location object if needed
     * @param url
     * @returns {object}
     */
    static extractQueryParams(url: string = '') {
        let params = {};

        const queryParams = Object(url.substr(1).split('&').filter(item => item.length));

        for (let i = 0; i < queryParams.length; i++) {
            let [key, value] = queryParams[i].split('=');

            if (!isNaN(value)) {
                params[key] = Number(value);
            } else if (value === 'true' || value === 'false') {
                params[key] = value === 'true';
            } else {
                params[key] = value;
            }
        }

        return params;
    }

    /**
     * Initialize testing:
     * use this when loading the page for the first time
     */
    initialize(config: Object, callback: Function) {
        this.setupEnvironment(config);
        this.qualify();
        this.isReady = true;

        if (typeof callback == 'function') {
            callback();
        }
    }

    /**
     * Initialize options
     */
    setupOptions(options: Object) {
        this.options = Object.assign({
            debug: false,
            config: {}
        }, options);

        if (this.options.debug) {
            debug.group(debug.SETUP_OPTIONS);
            console.log(options);
            console.groupEnd();
        }
    }

    /**
     * Initialize testing environment
     */
    setupEnvironment(custom: Object) {
        // View information
        // console.log(Testing.extractQueryParams(env.search()))
        const view = Object.assign(
            {
                path: get(custom, 'path', env.href()),
                query: get(custom, 'query', { default: Testing.extractQueryParams(env.search()) })
            },
            get(custom, 'view', { default: {} })
        );

        // Viewport information
        const viewport = {
            mainBucket: this.getMainTrafficBucket(),
            doNotTrack: env.doNotTrack(),
            width: env.width(),
            height: env.height(),
            userAgent: env.UA,
        };

        // Targeting information
        const targeting = Object.assign({
            location: null,
            viewport: {
                min: -1,
                max: -1,
            },
            platform: null,
        }, get(custom, 'targeting', { default: {} }));

        this.env = { view, viewport, targeting };

        if (this.options.debug) {
            debug.group(debug.SETUP_ENVIRONMENT);
            console.log(this.env);
            console.groupEnd();
        }
    }

    /**
     * Qualify visitor for experiments
     */
    qualify() {
        // 1. Get experiments based on bucket
        let experiments = this.loadExperiments();

        // 2. Check view targeting (URL)
        experiments = experiments.filter((experiment) => this.filterWithView(experiment));

        // 3. Check segment targeting
        experiments = experiments.filter((experiment) => this.filterWithSegment(experiment));

        // 3. Reduce to 1 variation per experiment to prepare for display
        experiments = experiments.map((experiment) => this.filterVariationsWithBucket(experiment));

        this.experiments = experiments;
        this.isQualified = true;
    }

    /**
     * Go through experiments and load only the relevant experiments
     * based on visitor main bucket and if query params are present
     * @returns {Array}
     */
    loadExperiments() {
        let experiments = [];

        // Load live main experiments
        experiments.push(...get(this.config, 'live.experiments', []));

        // Load live bucketed experiments if relevant
        experiments.push(...this.getBucketedExperiments(get(this.config, 'live', { default: {} })));

        // Load draft experiments if query params forced
        if (this.shouldForceQueryParams()) {
            // Load draft main experiments
            experiments.push(...get(this.config, 'draft.experiments', []));

            // Load draft bucketed experiments if relevant
            experiments.push(...this.getBucketedExperiments(get(this.config, 'draft', { default: {} })));
        }

        if (this.options.debug) {
            debug.group(debug.LOADING_EXPERIMENTS);
            console.log(experiments);
            console.groupEnd();
        }

        return experiments;
    }

    /**
     * Retrieve bucketed experiments
     * @param group
     * @returns {array}
     */
    getBucketedExperiments(group: Object) {
        if (this.getMainTrafficBucket() <= get(group, 'bucketed.max')) {
            for (let bucket of get(group, 'bucketed.buckets')) {
                const max = get(bucket, 'max');
                if (this.getMainTrafficBucket() <= max && this.getMainTrafficBucket() <= max) {
                    return get(bucket, 'experiments');
                }
            }
        }

        return [];
    }

    /**
     * Go through each experiment and filters their variation to
     * reduce to 1 based on visitor bucket
     * @param experiment
     * @returns {boolean}
     */
    filterVariationsWithBucket(experiment: Object) {
        // // @TODO Assign bucket to visitor for experiment and filter variation
        const bucket = this.getExperimentBucket(experiment);
        let variations = get(experiment, 'variations');

        variations = variations.filter((variation) => {
            return bucket >= get(variation, 'traffic_allocation.min')
                && bucket <= get(variation, 'traffic_allocation.max');
        });

        variations.map((variation) => {
            variation.experiment_id = experiment.id;
            return variation;
        });

        experiment.variations = variations;

        return experiment;
    }

    /**
     * Check visitor view options and check if qualified for given experiment
     * @param experiment
     * @returns {boolean}
     */
    filterWithView(experiment: Object) {
        let isQualifiedForView = this.qualifyView(experiment);

        if (this.options.debug) {
            debug.group(
                isQualifiedForView ? debug.TARGETING_VIEW_QUALIFIED : debug.TARGETING_VIEW_NOT_QUALIFIED
            );
            console.log(`Experiment: #${experiment.id} - ${experiment.name}`);
            console.log(`Current URL: ${get(this.env, 'view.path')}`);
            console.log(`Current Query Params: `, get(this.env, 'view.query'));
            console.log(experiment);
            console.groupEnd();
        }

        return isQualifiedForView;
    }

    /**
     * Check visitor segment options and check if qualified for given experiment
     * @param experiment
     * @returns {boolean}
     */
    filterWithSegment(experiment: Object) {
        let isQualifiedForSegment = this.qualifySegment(experiment);

        if (this.options.debug) {
            debug.group(
                isQualifiedForSegment ? debug.TARGETING_SEGMENT_QUALIFIED : debug.TARGETING_SEGMENT_NOT_QUALIFIED
            );

            console.groupEnd();
        }

        return isQualifiedForSegment;
    }

    /**
     * Qualify visitor for given experiment based on current view (URL)
     * @param experiment
     * @returns {boolean}
     */
    qualifyView(experiment: Object) {
        const path = get(this.env, 'view.path');
        const excludes = get(experiment, 'targeting.views.exclude');

        for (let i = 0; i < excludes.length; i++) {
            if (path.match(excludes[i]).toString()) {
                return false;
            }
        }

        const includes = get(experiment, 'targeting.views.include');

        if (includes != null && includes.length > 0) {
            if (includes[0] === '*') {
                return true;
            }

            for (let i = 0; i < includes.length; i++) {
                if (path.match(includes[i].toString())) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Qualify visitor for given experiment based on segment
     * @returns {boolean}
     */
    qualifySegment() {
        return true;
    }

    /**
     * Retrieve or generate main traffic bucket for visitor
     * @returns {number}
     */
    getMainTrafficBucket() {
        let bucket = env.inBrowser && localStorage.getItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY);

        if (!bucket) {
            bucket = Testing.generateTrafficBucket();
            env.inBrowser && localStorage.setItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY, bucket.toString());
        }

        return bucket;
    }

    /**
     * Get a traffic bucket for a given experiment
     * @param experiment
     * @returns {number}
     */
    getExperimentBucket(experiment: Object) {
        if (env.inBrowser) {
            let bucket = localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY)
                ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY) || '')
                : {};

            if (!bucket[experiment.id]) {
                bucket[experiment.id] = Testing.generateTrafficBucket();
                env.inBrowser && localStorage.setItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY, JSON.stringify(bucket));
            }

            return bucket[experiment.id];
        }

        return 0;
    }

    /**
     * Should the query params be forced?
     * @returns {boolean}
     */
    shouldForceQueryParams() {
        if (Object.keys(get(this.env, 'view.query' || {})).length && get(this.env, 'view.query.force', false)) {
            if (this.options.debug) {
                debug.group(debug.QUERY_PARAMS);
                console.log(get(this.env, 'view.query') || {});
                console.groupEnd();
            }

            return true;
        }

        return false;
    }
}

export default Testing;
