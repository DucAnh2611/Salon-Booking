import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    ICreateWorkingHour,
    IRangeWorkingHour,
    IUpdateWorkingHour,
    IWorkingHourDetail,
} from "@/interface/api/working-hour.interface";
import { IActionDedicateWorkingHour } from "@/interface/redux/working-hour.interface";
import { apiCall } from "@/utils/apiCall";
import { format } from "date-fns";
import { TAppDispatch } from "../store";

/** @WORKING_HOUR_RANGE */
const rangeWorkingHourType = EReduxType.WORKING_HOUR_RANGE;
export const rangeWorkingHourApi =
    (from: Date, end: Date) => async (dispatch: TAppDispatch) => {
        const fromDate = format(from, "yyyy/MM/dd");
        const endDate = format(end, "yyyy/MM/dd");

        const api = API_URLS.WORKING_HOUR.RANGE(fromDate, endDate);
        dispatch(isDispatchCalling(rangeWorkingHourType));

        const { response } = await apiCall<IRangeWorkingHour>({ ...api });

        if (response) {
            const { items, count } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateWorkingHour>(
                    rangeWorkingHourType,
                    {
                        count,
                        workingHours: items,
                    }
                )
            );
        } else {
            dispatch(isDispatchFailed(rangeWorkingHourType));
        }
    };

/** @WORKING_HOUR_CREATE */
const createWorkingHourType = EReduxType.WORKING_HOUR_CREATE;
export const createWorkingHourApi =
    (payload: ICreateWorkingHour) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.WORKING_HOUR.CREATE();
        dispatch(isDispatchCalling(createWorkingHourType));

        const { response } = await apiCall<IRangeWorkingHour>({
            ...api,
            payload,
        });

        if (response) {
            dispatch(isDispatchSuccess(createWorkingHourType));
        } else {
            dispatch(isDispatchFailed(createWorkingHourType));
        }
    };

/** @WORKING_HOUR_DETAIL */
const detailWorkingHourType = EReduxType.WORKING_HOUR_DETAIL;
export const detailWorkingHourApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.WORKING_HOUR.DETAIL(id);

        dispatch(isDispatchCalling(detailWorkingHourType));

        const { response } = await apiCall<IWorkingHourDetail>({
            ...api,
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateWorkingHour>(
                    detailWorkingHourType,
                    {
                        detail: response.result,
                    }
                )
            );
        } else {
            dispatch(isDispatchFailed(detailWorkingHourType));
        }
    };

/** @WORKING_HOUR_CREATE */
const updateWorkingHourType = EReduxType.WORKING_HOUR_CREATE;
export const updateWorkingHourApi =
    (payload: IUpdateWorkingHour) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.WORKING_HOUR.UPDATE();
        dispatch(isDispatchCalling(updateWorkingHourType));

        const { response } = await apiCall({
            ...api,
            payload,
        });

        if (response) {
            dispatch(isDispatchSuccess(updateWorkingHourType));
        } else {
            dispatch(isDispatchFailed(updateWorkingHourType));
        }
    };

/** @WORKING_HOUR_TOGGLE_OFF */
const toggleOffWorkingHourType = EReduxType.WORKING_HOUR_TOGGLE_OFF;
export const toggleOffWorkingHourApi =
    (date: Date) => async (dispatch: TAppDispatch) => {
        const day = format(date, "yyyy/MM/dd");
        const api = API_URLS.WORKING_HOUR.TOGGLE_OFF(day);

        dispatch(isDispatchCalling(toggleOffWorkingHourType));

        const { response } = await apiCall({
            ...api,
        });

        if (response) {
            dispatch(isDispatchSuccess(toggleOffWorkingHourType));
        } else {
            dispatch(isDispatchFailed(toggleOffWorkingHourType));
        }
    };

/** @WORKING_HOUR_DELETE */
const deleteWorkingHourType = EReduxType.WORKING_HOUR_DELETE;
export const deleteWorkingHourApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.WORKING_HOUR.DELETE();

        dispatch(isDispatchCalling(deleteWorkingHourType));

        const { response } = await apiCall({
            ...api,
            payload: {
                workingHourIds: ids,
            },
        });

        if (response) {
            dispatch(isDispatchSuccess(deleteWorkingHourType));
        } else {
            dispatch(isDispatchFailed(deleteWorkingHourType));
        }
    };
