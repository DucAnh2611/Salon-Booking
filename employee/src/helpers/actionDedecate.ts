import { EReduxDispatchDedicateState } from "@/enum/type-redux.enum";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";

export const isCallingApi = (action: IDispatchDedicateRedux) =>
    action.state === EReduxDispatchDedicateState.CALLING;

export const isSuccessfulApiCall = (action: IDispatchDedicateRedux) =>
    action.state === EReduxDispatchDedicateState.SUCCESS;

export const isFailedApiCall = (action: IDispatchDedicateRedux) =>
    action.state === EReduxDispatchDedicateState.FAILURE;
