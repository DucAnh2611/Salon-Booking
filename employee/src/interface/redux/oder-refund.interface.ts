import { IBaseInitialState } from "./base.interface";

export interface IInitialStateOrderRefund extends IBaseInitialState {
    isApproving: boolean;
    isDeclining: boolean;
}

export interface IActionDedicateOrderRefund {}
