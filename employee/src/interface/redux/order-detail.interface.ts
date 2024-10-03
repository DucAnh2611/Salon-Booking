import {
    IOrderDetail,
    IOrderDetailRefund,
    IOrderDetailState,
    IOrderDetailTransaction,
} from "../api/order-detail.interface";
import { IProductItemOrder } from "../api/product.interface";
import { IServiceItemOrder } from "../api/service.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateOrderDetail {
    base: IStateOrderDetailBase;
    refund: IStateOrderDetailRefund;
    status: IStateOrderDetailState;
    transaction: IStateOrderDetailTransaction;
    product: IStateOrderDetailProduct;
    service: IStateOrderDetailService;
}

export interface IActionDedicateOrderDetail {
    base?: Pick<IStateOrderDetailBase, "base">;
    refund?: Pick<IStateOrderDetailRefund, "refunds">;
    status?: Pick<IStateOrderDetailState, "states">;
    transaction?: Pick<IStateOrderDetailTransaction, "transactions">;
    product?: Pick<IStateOrderDetailProduct, "products">;
    service?: Pick<IStateOrderDetailService, "services">;
}

interface IStateOrderDetailBase extends IBaseInitialState {
    base: IOrderDetail | null;
    reload: boolean;
}

interface IStateOrderDetailRefund extends IBaseInitialState {
    refunds: IOrderDetailRefund[];
}

interface IStateOrderDetailTransaction extends IBaseInitialState {
    transactions: IOrderDetailTransaction[];
}

interface IStateOrderDetailState extends IBaseInitialState {
    states: IOrderDetailState[];
    reload: boolean;
}

interface IStateOrderDetailProduct extends IBaseInitialState {
    products: IProductItemOrder[];
}

interface IStateOrderDetailService extends IBaseInitialState {
    services: IServiceItemOrder[];
}
