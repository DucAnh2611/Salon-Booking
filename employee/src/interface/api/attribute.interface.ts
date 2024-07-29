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

export interface IAttributeProductValue {
    id: string;
    value: string;
}

export interface IAttributeProduct {
    first: {
        attribute: IAttribute | null;
        values: IAttributeProductValue[];
    };
    second: {
        attribute: IAttribute | null;
        values: IAttributeProductValue[];
    };
}
