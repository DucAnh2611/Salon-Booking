import {
    EReduxDispatchDedicateState,
    EReduxType,
} from "@/enum/type-redux.enum";

export const isDispatchCalling = <T extends object>(
    type: EReduxType,
    payload: T | null = null
) => ({
    state: EReduxDispatchDedicateState.CALLING,
    type,
    ...payload,
});

export const isDispatchSuccess = <T extends object>(
    type: EReduxType,
    payload: T | null = null
) => ({
    state: EReduxDispatchDedicateState.SUCCESS,
    type,
    ...payload,
});

export const isDispatchFailed = <T extends object>(
    type: EReduxType,
    payload: T | null = null
) => ({
    state: EReduxDispatchDedicateState.FAILURE,
    type,
    ...payload,
});
