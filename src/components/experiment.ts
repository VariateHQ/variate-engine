import Variation from './variation';

export default class Experiment {
    public id!: string;
    public siteId!: string;
    public name?: string;
    public variations: Variation[];
}
