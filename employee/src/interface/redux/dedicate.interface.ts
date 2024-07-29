import {
    EReduxDispatchDedicateState,
    EReduxType,
} from "@/enum/type-redux.enum";

export interface IDispatchDedicateType {
    type: EReduxType;
}

export interface IDispatchDedicateRedux extends IDispatchDedicateType {
    state: EReduxDispatchDedicateState;
}
