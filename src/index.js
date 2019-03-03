import version from './lang/version';
import * as debug from './lang/debug';
import * as errors from './lang/errors';
import * as warnings from './lang/warnings';
import _ from './utilities';

const LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY = 'testing-tool-main-bucket';
const LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY = 'testing-tool-buckets';

class Testing {
    constructor(options) {
        options.debug && version.show();
        this.setupOptions(options);
    }

    /**
     * Get testing options
     * @returns {*}
     */
    get options() {
        return this._options;
    }

    /**
     * Set testing options
     * @param options
     */
    set options(options) {
        this._options = Object.assign({}, this._options, options);
    }

    /**
     * Get testing configuration
     * @returns {*}
     */
    get config() {
        return this._options.config;
    }

    /**
     * Set testing configuration
     * @param config
     */
    set config(config) {
        this._options.config = config;
    }

    /**
     * Get status of the testing tool
     * @returns {*|boolean}
     */
    get isReady() {
        return this._isReady;
    }

    /**
     * Set status of the testing tool
     * @param value
     */
    set isReady(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError(errors.IS_READY_TYPE_ERROR);
        }
        this._isReady = value;
    }

    /**
     * Get qualification status for visitor
     * @returns {*|boolean}
     */
    get isQualified() {
        return this._isQualified;
    }

    /**
     * Set qualification status for visitor
     * @param value
     */
    set isQualified(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError(errors.IS_QUALIFIED_TYPE_ERROR);
        }
        this._isQualified = value;
    }

    /**
     * Get testing environment
     * @returns {*}
     */
    get env() {
        return this._env;
    }

    /**
     * Set testing environment
     * @param value
     */
    set env(value) {
        this._env = Object.assign({}, this._env, value);
    }

    /**
     * Get active experiments
     * @returns {*|Array}
     */
    get experiments() {
        return this._experiments || [];
    }

    /**
     * Set active experiments
     * @param value
     */
    set experiments(value) {
        this._experiments = value || [];
    }

    /**
     * Get active experiments
     * @returns {*|Array}
     */
    get variations() {
        return this.experiments.map((experiment) => experiment.variations).flat();
    }

    /**
     * Get all components
     * @returns {*|Array}
     */
    get components() {
        return Object.assign({}, ...this.variations.map((variation) => {
            Object.keys(variation.components).map((key) => {
                variation.components[key].bucket = this.getExperimentBucket({ id: variation.experiment_id });
                variation.components[key].experiment_id = variation.experiment_id;
                variation.components[key].variation_id = variation.id;
            });

            return variation.components;
        }).flat());
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
    static extractQueryParams(url = '') {
        let params = {};

        const queryParams = Object(url.substr(1).split('&').filter(item => item.length));

        for (var i = 0; i < queryParams.length; i++) {
            let [key, value] = queryParams[i].split('=');

            if (!isNaN(value)) {
                params[key] = Number(value);
            } else if (value == 'true' || value == 'false') {
                params[key] = value == 'true' ? true : false;
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
    initialize(config, callback) {
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
    setupOptions(options) {
        this.options = Object.assign({
            debug: false,
            config: {}
        }, options);

        if(this.options.debug) {
            debug.group(debug.SETUP_OPTIONS);
            console.debug(options);
            console.groupEnd();
        }
    }

    /**
     * Initialize testing environment
     */
    setupEnvironment(custom) {
        // View information
        const view = Object.assign({
                path: _.value('path', custom) || _.href(),
                query: _.value('query', custom) || Testing.extractQueryParams(_.search())
            },
            _.objectValue('view', custom)
        );

        // Viewport information
        const viewport = {
            mainBucket: this.getMainTrafficBucket(),
            doNotTrack: _.doNotTrack(),
            width: _.width(),
            height: _.height(),
            userAgent: _.UA,
        };

        // Targeting information
        const targeting = Object.assign({
            location: null,
            viewport: {
                min: -1,
                max: -1,
            },
            platform: null,
        }, _.objectValue('targeting', custom));

        this.env = { view, viewport, targeting };

        if(this.options.debug) {
            debug.group(debug.SETUP_ENVIRONMENT);
            console.debug(this.env);
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
        experiments.push(..._.arrayValue('live.experiments', this.config));

        // Load live bucketed experiments if relevant
        experiments.push(...this.getBucketedExperiments(_.objectValue('live', this.config)));

        // Load draft experiments if query params forced
        if (this.shouldForceQueryParams()) {
            // Load draft main experiments
            experiments.push(..._.arrayValue('draft.experiments', this.config));

            // Load draft bucketed experiments if relevant
            experiments.push(...this.getBucketedExperiments(_.objectValue('draft', this.config)));
        }

        if (this.options.debug) {
            debug.group(debug.LOADING_EXPERIMENTS);
            console.debug(experiments);
            console.groupEnd();
        }

        return experiments;
    }

    /**
     * Retrieve bucketed experiments
     * @param group
     * @returns {*}
     */
    getBucketedExperiments(group) {
        if (this.getMainTrafficBucket() <= _.arrayValue('bucketed.max', group)) {
            for (let bucket of _.arrayValue('bucketed.buckets', group)) {
                if (this.getMainTrafficBucket() <= _.value('max', bucket) && this.getMainTrafficBucket() <= _.value('max', bucket)) {
                    return _.arrayValue('experiments', bucket);
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
    filterVariationsWithBucket(experiment) {
        // // @TODO Assign bucket to visitor for experiment and filter variation
        const bucket = this.getExperimentBucket(experiment);
        let variations = _.arrayValue('variations', experiment);

        variations = variations.filter((variation) => {
            return bucket >= _.value('traffic_allocation.min', variation)
                && bucket <= _.value('traffic_allocation.max', variation);
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
    filterWithView(experiment) {
        let isQualifiedForView = this.qualifyView(experiment);

        if (this.options.debug) {
            debug.group(
                isQualifiedForView ? debug.TARGETING_VIEW_QUALIFIED : debug.TARGETING_VIEW_NOT_QUALIFIED
            );
            console.debug(`Experiment: #${experiment.id} - ${experiment.name}`);
            console.debug(`Current URL: ${_.value('view.path', this.env)}`);
            console.debug(`Current Query Params: `, _.value('view.query', this.env));
            console.debug(experiment);
            console.groupEnd();
        }

        return isQualifiedForView;
    }

    /**
     * Check visitor segment options and check if qualified for given experiment
     * @param experiment
     * @returns {boolean}
     */
    filterWithSegment(experiment) {
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
    qualifyView(experiment) {
        const path = _.value('view.path', this.env);
        const excludes = _.arrayValue('targeting.views.exclude', experiment);

        for (let i = 0; i < excludes.length; i++) {
            if (path.match(excludes[i]).toString()) {
                return false;
            }
        }

        const includes = _.arrayValue('targeting.views.include', experiment);

        if (includes != null && includes.length > 0) {
            if (includes[0] === '*' || includes[0] === '\*') {
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
    qualifySegment(experiment) {
        return true;
    }

    /**
     * Retrieve or generate main traffic bucket for visitor
     * @returns {number}
     */
    getMainTrafficBucket() {
        let bucket = _.inBrowser && localStorage.getItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY);

        if (!bucket) {
            bucket = Testing.generateTrafficBucket();
            _.inBrowser && localStorage.setItem(LOCAL_STORAGE_MAIN_TRAFFIC_BUCKET_KEY, bucket);
        }

        return bucket;
    }

    getExperimentBucket(experiment) {
        if (_.inBrowser) {
            let bucket = localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY)
                ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY))
                : {};

            if (!bucket[experiment.id]) {
                bucket[experiment.id] = Testing.generateTrafficBucket();
                _.inBrowser && localStorage.setItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY, JSON.stringify(bucket));
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
        if (Object.keys(_.objectValue('view.query', this.env)).length && _.objectValue('view.query.force', this.env)) {
            if(this.options.debug) {
                debug.group(debug.QUERY_PARAMS);
                console.debug(_.objectValue('view.query', this.env));
                console.groupEnd();
            }

            return true;
        }

        return false;
    }
}

export default Testing;
