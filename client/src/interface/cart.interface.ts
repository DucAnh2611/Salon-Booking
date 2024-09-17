import { IProduct, IProductItemCart } from "./product.interface";
import { IDistrict, IProvince, IWard } from "./province.interface";

export interface IApiAddProductCart {
    productId: string;
    productTypeId?: string;
    quantity: number;
}

export interface IApiUpdateProductCart {
    id: string;
    quantity: number;
}

export interface IContactCart {
    name: string;
    address: IContactCartAdress;
    phone: string;
    note?: string;
}

export interface IContactCartAdress {
    province: IProvince | null;
    district: IDistrict | null;
    ward: IWard | null;
    street: string;
}

export interface IApiCartProductAmount {
    itemIds: string[];
    cartProductId: string;
}

export interface ICartProductAmount {
    cartAmount: number;
    taxAmount: number;
    tax: number;
    total: number;
}

export interface ICartProduct {
    id: string;
    products: IProductItemCart[];
}

export interface ICartService {
    services: IProduct[];
}
