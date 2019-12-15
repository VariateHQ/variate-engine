export default class Component {
    public id!: string;
    public bucket?: number;
    public variationId!: string;
    public experimentId!: string;
    public siteId!: string;
    public variables: any;
    public experiments?: any[];
}
