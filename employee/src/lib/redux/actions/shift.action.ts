import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IShiftAssignmentAdd,
    IShiftAssignmentRemove,
    IShiftCreate,
    IShiftDetail,
    IShiftUpdate,
} from "@/interface/api/shift.interface";
import { IActionDedicateShift } from "@/interface/redux/shift.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @SHIFT_DETAIL */
const detailShiftType = EReduxType.SHIFT_DETAIL;
export const detailShiftApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT.DETAIL(id);

        dispatch(isDispatchCalling(detailShiftType));

        const { response } = await apiCall<IShiftDetail>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateShift>(detailShiftType, {
                    detail: response.result,
                })
            );
        } else {
            dispatch(isDispatchFailed(detailShiftType));
        }
    };

/** @SHIFT_CREATE */
const createShiftType = EReduxType.SHIFT_CREATE;
export const createShiftApi =
    (payload: IShiftCreate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT.CREATE();

        dispatch(isDispatchCalling(createShiftType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(createShiftType));
        } else {
            dispatch(isDispatchFailed(createShiftType));
        }
    };

/** @SHIFT_UPDATE */
const updateShiftType = EReduxType.SHIFT_UPDATE;
export const updateShiftApi =
    (payload: IShiftUpdate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT.UPDATE();

        dispatch(isDispatchCalling(updateShiftType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(updateShiftType));
        } else {
            dispatch(isDispatchFailed(updateShiftType));
        }
    };

/** @SHIFT_DELETE */
const deleteShiftType = EReduxType.SHIFT_DELETE;
export const deleteShiftApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT.DELETE(id);

        dispatch(isDispatchCalling(deleteShiftType));

        const { response } = await apiCall({ ...api });

        if (response) {
            dispatch(isDispatchSuccess(deleteShiftType));
        } else {
            dispatch(isDispatchFailed(deleteShiftType));
        }
    };

/** @SHIFT_ASSIGNMENT_REMOVE */
const assignmentRemoveType = EReduxType.SHIFT_ASSIGNMENT_REMOVE;
export const assignmentRemoveApi =
    (payload: IShiftAssignmentRemove) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT_ASSIGNMENT.DELETE();

        dispatch(isDispatchCalling(assignmentRemoveType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(assignmentRemoveType));
        } else {
            dispatch(isDispatchFailed(assignmentRemoveType));
        }
    };

/** @SHIFT_ASSIGNMENT_ADD */
const assignmentAddType = EReduxType.SHIFT_ASSIGNMENT_ADD;
export const assignmentAddApi =
    (payload: IShiftAssignmentAdd) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SHIFT_ASSIGNMENT.CREATE();

        dispatch(isDispatchCalling(assignmentAddType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(assignmentAddType));
        } else {
            dispatch(isDispatchFailed(assignmentAddType));
        }
    };
