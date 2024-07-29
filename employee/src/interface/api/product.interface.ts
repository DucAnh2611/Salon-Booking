import { IAttribute } from "./attribute.interface";
import { ICategory } from "./category.interface";
import { IEmployeeModify, IUserEmployee } from "./employee.interface";
import { IMedia, IMediaProductTempUrlCreate } from "./media.interface";

export interface IProduct {
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    sku: string;
    brand: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    userCreate: IEmployeeModify;
    userUpdate: IEmployeeModify;
    productMedia: IProductMedia[];
}

export interface IProductInfo {
    base: IProductBaseInfo;
    details: IProductDetailUpdate[];
    types: IProductTypeInfo[];
}

export interface IFindProduct {
    page: number;
    limit: number;
    count: number;
    items: IProduct[];
}

export interface IProductBaseInfo {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    sku?: string;
    brand: string;
    price: number;
    categoryId: string;
    category: ICategory;
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
    createdAt: Date;
    updatedAt: Date;
    media: IProductMedia[];
}

export interface IProductTypeUpdate {
    productTypesId?: string;
    price: number;
    quantity: number;
    sku: string;
    types: IProductTypeAttributeUpdate[];
}

export interface IProductTypeAttributeUpdate {
    attrId: string;
    value: string;
    attrName: string;
    level: number;
}

export interface IProductBaseUpdate {
    name: string;
    description?: string;
    quantity: number;
    sku?: string;
    brand: string;
    price: number;
    categoryId: string;
    thumbnailIds?: { id: string; isThumbnail: boolean }[];
    thumbnailUrls?: IMediaProductTempUrlCreate[];
}

export interface IProductUpdate {
    productId: string;
    base: IProductBaseUpdate;
    details: IProductDetailUpdateForm[];
    types: IProductTypeUpdate[];
}

export interface IProductTypeInfo {
    id: string;
    quantity: number;
    price: number;
    sku: string;
    productTypesAttribute: IProductTypeAttributeInfo[];
}

export interface IProductTypeAttributeInfo {
    productTypesId: string;
    attributeId: string;
    value: string;
    level: number;
    attribute: IAttribute;
}

export interface IProductBaseCreate {
    name: string;
    description?: string;
    thumbnailIds?: { id: string; isThumbnail: boolean }[];
    thumbnailUrls?: IMediaProductTempUrlCreate[];
    quantity: number;
    sku?: string;
    brand: string;
    categoryId: string;
}

export interface IProductCreate {
    base: IProductBaseCreate;
    types: IProductType[];
    details: IProductDetailCreate[];
}

export interface IProductMedia {
    productId: string;
    mediaId: string;
    isThumbnail: boolean;
    media: IMedia;
}

export interface IProductDetail {
    id: string;
    key: string;
    value: string;
}

export interface IProductDetailUpdate {
    key: string;
    value: string;
    id: string;
}
export interface IProductDetailUpdateForm {
    key: string;
    value: string;
    id?: string;
}

export interface IProductDetailCreate {
    key: string;
    value: string;
}

export interface IProductType {
    quantity: number;
    price: number;
    sku?: string;
    types: IProductTypeAttribute[];
}

export interface IProductTypeAttribute {
    attrId: string;
    attrName: string;
    value: string;
    level: number;
}
