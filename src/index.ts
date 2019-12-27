import jsonLogic from 'json-logic-js';
import deepmerge from 'deepmerge';
import get from 'get-value';
import version from './lang/version';
import Options from './components/options';
import Environment from './components/environment';
import Event from './components/event';
import Experiment from './components/experiment';
import Variation from './components/variation';
import { EventTypes } from './config/event-types';
import * as debug from './lang/debug';
import * as errors from './lang/errors';
import env from './utilities/env';

const LOCAL_STORAGE_UUID_KEY = 'variate-uuid';
const LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY = 'variate-buckets';

class Variate {
    private _options: Options;
    private _env: Environment;
    private _experiments: Experiment[];
    public isReady: boolean = false;
    public isQualified: boolean = false;

    /**
     * @param {object} options
     */
    constructor(options: Partial<Options>) {
        options.debug && version.show();
        this.options = new Options(options);
    }

    /**
     * Get testing options
     * @returns {Options}
     */
    get options(): Options {
        return this._options;
    }

    /**
     * Set testing options
     * @param options
     */
    set options(options: Options) {
        this._options = options;

        if (this._options.debug) {
            console.groupCollapsed(debug.SETUP_OPTIONS);
            console.log(this._options);
            console.groupEnd();
        }
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
     * Get testing environment
     * @returns {object}
     */
    get env(): Environment {
        return this._env;
    }

    /**
     * Set testing environment
     * @param value
     */
    set env(value: Environment) {
        // View information
        const { path, query } = get(value, 'view', {
            default: {
                path:  env.href(),
                query: Variate.extractQueryParams(env.search())
            }
        });
        const view = { path, query };

        // Viewport information
        const viewport = {
            visitorId: this.getUUID(),
            doNotTrack: env.doNotTrack(),
            width: env.width(),
            height: env.height(),
            userAgent: env.UA,
        };

        // Targeting information
        const targeting = get(value, 'targeting', {default: {}});

        this._env = Object.assign({}, this._env, {view, viewport, targeting});

        if (this._options.debug) {
            console.groupCollapsed(debug.SETUP_ENVIRONMENT);
            console.log(this.env);
            console.groupEnd();
        }
    }

    /**
     * Get active experiments
     * @returns {Array<Experiment>}
     */
    get experiments(): Array<Experiment> {
        return this._experiments || new Array<Experiment>();
    }

    /**
     * Set active experiments
     * @param value Array<Experiment>
     */
    set experiments(value: Array<Experiment>) {
        this._experiments = value || new Array<Experiment>();
    }

    /**
     * Get active experiments
     * @returns {Array<Variation>}
     */
    get variations(): Array<Variation> {
        return this.experiments.map((experiment) => experiment.variations).reduce((acc, val) => acc.concat(val), []);
    }

    /**
     * Get all components
     * @returns any
     */
    get components(): any {
        return deepmerge.all(this.variations.map(this.extractVariationComponents.bind(this)));
    }

    /**
     * Extract variation components
     * @param variation
     * @returns {array}
     */
    extractVariationComponents(variation: Variation) {
        const bucket = this.getExperimentBucket({ id: variation.experimentId });

        for (let component of Object.values(variation.components)) {
            // components.shift();
            component.bucket = bucket;
        }

        return variation.components;
    }

    /**
     * Generate visitor UUID
     * @returns {string}
     */
    static generateUUID() {
        let timestamp = Date.now();
        let random = Math.floor(Math.random() * 900000000) + 100000000;

        return 'V-' + timestamp + '-' + random;
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
        let params: any = {};

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
    initialize(config?: Partial<Environment>, callback?: Function) {
        this._options.debug && console.time('[BENCHMARK] Variate Initialization');
        this.env = config || new Environment;
        this.qualify();
        this.isReady = true;
        this._options.debug && console.timeEnd('[BENCHMARK] Variate Initialization');

        if (typeof callback == 'function') {
            callback();
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

        // 3. Check audience targeting
        experiments = experiments.filter((experiment) => this.filterWithSegment(experiment));

        // 3. Reduce to 1 variation per experiment to prepare for display
        experiments = experiments.map((experiment) => this.filterVariationsWithBucket(experiment));

        // 4. Send pageview event if enabled
        experiments.forEach((experiment) => {
            const [variation] = Object.values(get(experiment, 'variations', {
                default: {}
            }));

            if (this._options.tracking.enabled && (this._options.pageview || !experiment.manualPageview)) {
                this.track('Pageview', EventTypes.PAGEVIEW, {
                    experimentId: experiment.id,
                    variationId: variation.id,
                });
            }
        });

        this.experiments = experiments;
        this.isQualified = true;
    }

    /**
     * Go through experiments and load only the relevant experiments
     * based on visitor main bucket and if query params are present
     * @returns {Array}
     */
    loadExperiments(): Experiment[] {
        let experiments: Experiment[] = Object.values(get(this.config, 'experiments', {
            default: []
        }));

        if (this._options.debug) {
            console.groupCollapsed(debug.LOADING_EXPERIMENTS);
            experiments.forEach((experiment) => {
                console.groupCollapsed(`${experiment.name} (${experiment.id})`);
                console.log(`URL: https://variate.ca/sites/${experiment.siteId}/experiments/${experiment.id}`);
                console.groupEnd();
            });
            console.groupEnd();
        }

        return experiments;
    }

    /**
     * Go through each experiment and filters their variation to
     * reduce to 1 based on visitor bucket
     * @param experiment
     * @returns {boolean}
     */
    filterVariationsWithBucket(experiment: Experiment) {
        // // @TODO Assign bucket to visitor for experiment and filter variation
        const bucket = this.getExperimentBucket(experiment);
        let variations: Variation[] = Object.values(get(experiment, 'variations'));

        variations = variations.filter((variation: Variation) => {
            return bucket >= get(variation, 'trafficAllocation.min')
                && bucket <= get(variation, 'trafficAllocation.max');
        });

        variations.map((variation: Variation) => {
            variation.experimentId = experiment.id;
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
    filterWithView(experiment: Experiment) {
        let isQualifiedForView = this.qualifyView(experiment);

        if (this._options.debug) {
            console.groupCollapsed(
                isQualifiedForView ? debug.VIEW_QUALIFIED : debug.VIEW_NOT_QUALIFIED
            );
            console.log(`Experiment: #${experiment.id} - ${experiment.name}`);
            console.log(`Experiment URL: https://variate.ca/sites/${experiment.siteId}/experiments/${experiment.id}`);
            console.log(`Current URL: ${get(this.env, 'view.path')}`);
            console.log(`Current Query Params: `, get(this.env, 'view.query'));
            console.log(experiment);
            console.groupEnd();
        }

        return isQualifiedForView;
    }

    /**
     * Check visitor audience options and check if qualified for given experiment
     * @param experiment
     * @returns {boolean}
     */
    filterWithSegment(experiment: Experiment) {
        let isQualifiedForAudience = this.qualifySegment(experiment);

        if (this._options.debug) {
            console.groupCollapsed(
                isQualifiedForAudience ? debug.SEGMENT_QUALIFIED : debug.SEGMENT_NOT_QUALIFIED
            );

            console.log(`Experiment: #${experiment.id} - ${experiment.name}`);
            console.log(`Experiment URL: https://variate.ca/sites/${experiment.siteId}/experiments/${experiment.id}`);
            console.log('Rules: ', get(experiment, 'targeting.segments'));
            console.log('Data: ', get(this.env, 'targeting'));

            console.groupEnd();
        }

        return isQualifiedForAudience;
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
            if (path.match(excludes[i])) {
                return false;
            }
        }

        const includes = get(experiment, 'targeting.views.include');

        if (includes != null && includes.length > 0) {
            if (includes[0] === '*') {
                return true;
            }

            for (let i = 0; i < includes.length; i++) {
                if (path.match(includes[i])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Qualify visitor for given experiment based on audience
     * @param experiment
     * @returns {boolean}
     */
    qualifySegment(experiment: Object) {
        const rules = get(experiment, 'targeting.segments', {
            default: true
        });
        const data = get(this.env, 'targeting', {});

        return jsonLogic.apply(rules, data);
    }

    /**
     * Retrieve or generate visitor UUID
     */
    getUUID() {
        let uuid = env.inBrowser && localStorage.getItem(LOCAL_STORAGE_UUID_KEY);

        if (!uuid) {
            uuid = Variate.generateUUID();
            env.inBrowser && localStorage.setItem(LOCAL_STORAGE_UUID_KEY, uuid);
        }

        return uuid;
    }

    /**
     * Get a traffic bucket for a given experiment
     * @param experiment
     * @returns {number}
     */
    getExperimentBucket(experiment: Pick<Experiment, 'id'>) {
        if (env.inBrowser) {
            let bucket = localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY)
                ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRAFFIC_BUCKETS_KEY) || '')
                : {};

            if (!bucket[experiment.id]) {
                bucket[experiment.id] = Variate.generateTrafficBucket();
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
        if (Object.keys(get(this.env, 'view.query' || {})).length && get(this.env, 'view.query.force', {
            default: false
        })) {
            if (this._options.debug) {
                console.groupCollapsed(debug.QUERY_PARAMS);
                console.log(get(this.env, 'view.query') || {});
                console.groupEnd();
            }

            return true;
        }

        return false;
    }

    /**
     * Track an event to Variate Reporting API
     * @param args
     * @returns {boolean}
     */
    track(...args: any): boolean {
        let event = this.extractTrackingArguments(args);

        if (!this._options.tracking.enabled) {
            this._options.debug && console.info(debug.TRACKING_DISABLED);
            return false;
        }

        try {
            let trackers = [];

            if (this._options.tracking.default) {
                trackers.push(this.report(event));
            }

            if (this._options.tracking.reporter) {
                if (typeof this._options.tracking.reporter !== 'function') {
                    throw new Error(errors.TRACKING_INVALID_REPORTER);
                }

                trackers.push(this._options.tracking.reporter(event));
            }

            Promise.all(trackers).then((response) => {
                let wasTracked = response.every(item => item);

                if (this._options.debug) {
                    console.groupCollapsed(wasTracked ? debug.TRACKING_EVENT_TRACKED : debug.TRACKING_EVENT_NOT_TRACKED);
                    console.log(response);
                    console.log(event);
                    console.groupEnd();
                }

                return wasTracked;
            }).catch(() => {
                return false;
            });
        } catch(e) {
            this._options.debug && console.error(e);
            return false;
        }
        
        return false;
    }

    extractTrackingArguments(args?: any[]) {
        if (typeof args === 'undefined' || !args.length) {
            throw new Error(errors.REQUIRED_PARAMETERS.replace('%s', 'track()'));
        }

        if (typeof args[0] === 'string') {
            const [name, type, value] = args;
            return new Event({name, type, value, context: this.env});
        }

        const {name, type, value} = args[0];
        return new Event({name, type, value, context: this.env});
    }

    report(event: Event) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://reporting.variate.ca/track', true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {
                if (this.status >= 200 && this.status < 300) {
                    resolve(true);
                } else {
                    reject(false);
                }
            };
            xhr.onerror = function () {
                reject(false);
            };

            xhr.send(event.toJson());
        });
    }
}

export default Variate;
