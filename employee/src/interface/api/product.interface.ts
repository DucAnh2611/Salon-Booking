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
    sku?: string;
    types: IProductTypeAttributeUpdate[];
}

export interface IProductTypeAttributeUpdate {
    value: IProductTypeAttributeValueUpdate;
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

export interface IProductTypesUpdate {
    selectAttribute: IAttributeValue;
    types: IProductTypeUpdate[];
}

export interface IProductUpdate {
    productId: string;
    base: IProductBaseUpdate;
    details: IProductDetailUpdateForm[];
    types: IProductTypesUpdate;
}

export interface IProductTypeInfo {
    id: string;
    quantity: number;
    price: number;
    sku: string;
    productTypesAttribute: IProductTypeAttributeInfo[];
}

export interface IProductAttributeValueInfo {
    id: string;
    value: string;
    attribute: IAttribute;
    attributeId: string;
}

export interface IProductTypeAttributeInfo {
    productTypesId: string;
    value: IProductAttributeValueInfo;
    attributeValueId: string;
    level: number;
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

export interface IProductTypeAttributeValueCreate {
    attrValueTempId: string;
    level: number;
}

export interface IAttributeValueUpdate {
    id?: string;
    value: string;
    tempId?: string;
}

export interface ILevelSelectAttributeValueCreate {
    attribute: IAttribute | null;
    value: IAttributeValueUpdate[];
}

export interface IAttributeValue {
    first?: ILevelSelectAttributeValueCreate;
    sec?: ILevelSelectAttributeValueCreate;
}

export interface IProductTypeAttributeCreate {
    value: IProductTypeAttributeValueCreate;
}

export interface IProductTypeCreate {
    quantity: number;
    price: number;
    sku?: string;
    types: IProductTypeAttributeCreate[];
}

export interface IProductTypesCreate {
    selectAttribute: IAttributeValue;
    types: IProductTypeCreate[];
}

export interface IProductCreate {
    base: IProductBaseCreate;
    types: IProductTypesCreate;
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

export interface IProductTypeAttributeValueUpdate {
    attrValueTempId?: string;
    attrValueId?: string;
    level: number;
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
    value: IProductTypeAttributeValueUpdate;
}
