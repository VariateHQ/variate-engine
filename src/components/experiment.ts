import Variation from './variation';

export default class Experiment {
    public id!: string;
    public name?: string;
    public variations: Variation[];
}
