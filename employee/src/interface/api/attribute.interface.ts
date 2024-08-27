export interface IAttribute {
    id: string;
    name: string;
}

export interface IFindAttribute {
    page: number;
    limit: number;
    count: number;
    items: IAttribute[];
}
