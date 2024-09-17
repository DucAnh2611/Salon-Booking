export interface IAttribute {
    id: string;
    name: string;
}

export interface IAttributeValue {
    id: string;
    value: string;
    attributeId: string;
    attribute: IAttribute;
}
