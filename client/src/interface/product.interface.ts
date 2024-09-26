import { IAttributeValue } from "./attribute.interface";
import { IMedia } from "./media.interface";

export interface IProduct {
    id: string;
    price: number;
    quantity: number;
    name: number;
    description: number;
    productMedia: IProductMedia[];
    deletedAt: Date;
}

export interface IProductInfo {
    base: IProductInfoBase;
    types: IProductInfoTypes[];
    detail: IProductInfoDetail[];
}

export interface IProductInfoBase {
    id: string;
    price: number;
    quantity: number;
    name: number;
    description: number;
    productMedia: IProductMedia[];
}

export interface IProductInfoTypes {
    id: string;
    productTypesAttribute: IProductInfoTypesAttribute[];
    price: number;
    quantity: number;
}

export interface IProductInfoTypesAttribute {
    id: string;
    level: number;
    value: IAttributeValue;
}

export interface IProductInfoDetail {
    id: string;
    key: string;
    value: string;
}

export interface IProductTypes {
    id: string;
    quantity: string;
    productId: string;
    productTypesAttribute: IProductTypeAttribute[];
    sku: string | null;
    price: number;
    deletedAt: Date;
}

export interface IProductTypeAttribute {
    id: string;
    attributeValueId: string;
    value: IAttributeValue;
    thumbnail: null | IMedia;
    thumbnailId: string | null;
    level: number;
}

export interface IProductMedia {
    productId: string;
    mediaId: string;
    isThumbnail: boolean;
    media: IMedia;
}

export interface IApiProductOnStock {
    productId: string;
    typeId?: string;
}

export interface IProductOnStock {
    quantity: number;
}

export interface IProductItemCart {
    id: string;
    cartProductId: string;

    product: IProduct;
    productId: string;

    productType: IProductTypes | null;
    productTypeId: string | null;

    quantity: number;

    createdAt: Date;
}

export interface IProductItemOrder {
    id: string;
    cartProductId: string;

    productSnapshot: IProduct;
    productId: string;

    productTypeSnapshot: IProductTypes | null;
    productTypeId: string | null;

    quantity: number;
    totalPrice: number;
    unitPrice: number;

    createdAt: Date;
}

export interface IProductOrderTracking {
    products: IProductItemOrder[];
}

export interface IApiSearchProductPriceRange {
    from: number;
    to?: number;
}

export interface IApiSearchProduct {
    key: string;
    price: IApiSearchProductPriceRange;
    categoryIds?: string[];
    orderBy?: string;
    page: number;
    limit: number;
}
