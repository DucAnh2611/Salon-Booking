import { IProductItemCart } from "./product.interface";
import { IDistrict, IProvince, IWard } from "./province.interface";
import { IServiceItemCartBooking } from "./service.interface";

export interface IApiAddProductCart {
    productId: string;
    productTypeId?: string;
    quantity: number;
}

export interface IApiAddServiceCart {
    serviceId: string;
}

export interface IApiUpdateProductCart {
    id: string;
    quantity: number;
}

export interface IContactCart {
    name: string;
    address: IContactCartAddress;
    phone: string;
    note?: string;
}

export interface IContactCartService {
    name: string;
    phone: string;
    note?: string;
}

export interface IContactCartAddress {
    province: IProvince | null;
    district: IDistrict | null;
    ward: IWard | null;
    street: string;
}

export interface IApiCartProductAmount {
    itemIds: string[];
    cartProductId: string;
}

export interface IApiCartServiceAmount {
    itemIds: string[];
    cartServiceId: string;
}

export interface ICartProductAmount {
    cartAmount: number;
    taxAmount: number;
    tax: number;
    total: number;
}

export interface ICartServiceAmount {
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
    id: string;
    services: IServiceItemCartBooking[];
}
