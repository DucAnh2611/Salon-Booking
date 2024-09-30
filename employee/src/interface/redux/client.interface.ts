import {
    IClientList,
    IFilterClientList,
    IOrderClientList,
} from "../api/client.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateClient extends IBaseInitialState {
    isUpdating: boolean;
    reload: boolean;
    clients: IClientList[];
    page: number;
    limit: number;
    count: number;
    filter: IFilterClientList;
    order: IOrderClientList;
}

export interface IActionDedicateClient {
    clients?: IClientList[];
    page?: number;
    limit?: number;
    count?: number;
    filter?: IFilterClientList;
    order?: IOrderClientList;
}
