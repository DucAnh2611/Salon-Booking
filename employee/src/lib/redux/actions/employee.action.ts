import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IEmployeeDetail,
    IFindEmployee,
} from "@/interface/api/employee.interface";
import { IActionDedicateEmployee } from "@/interface/redux/employee.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @EMPLOYEE_LIST */
const listEmployeeType = EReduxType.EMPLOYEE_LIST;
export const listEmployeeApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.LIST(page, limit, key, orderBy);

        dispatch(isDispatchCalling(listEmployeeType));

        const { response } = await apiCall<IFindEmployee>({ ...api });

        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateEmployee>(listEmployeeType, {
                    ...pagination,
                    employees: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(listEmployeeType));
        }
    };

/** @EMPLOYEE_DELETE_LIST */
const setListDeleteType = EReduxType.EMPLOYEE_DELETE_LIST;
export const setListDeleteEmployeeApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateEmployee>(setListDeleteType, {
                deleteItems: ids,
            })
        );
    };

/** @EMPLOYEE_DETAIL */
const detailEmployeeType = EReduxType.EMPLOYEE_DETAIL;
export const detailEmployeeApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.DETAIL(id);

        dispatch(isDispatchCalling(detailEmployeeType));

        const { response } = await apiCall<IEmployeeDetail>({
            ...api,
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateEmployee>(detailEmployeeType, {
                    detail: response.result,
                })
            );
        } else {
            dispatch(isDispatchFailed(detailEmployeeType));
        }
    };

/** @EMPLOYEE_DELETE */
const deleteEmployeeType = EReduxType.EMPLOYEE_DELETE;
export const deleteEmployeeApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.DELETE();

        dispatch(isDispatchCalling(deleteEmployeeType));

        const { response } = await apiCall({
            ...api,
            payload: { ids },
        });

        if (response) {
            dispatch(isDispatchSuccess(deleteEmployeeType));
        } else {
            dispatch(isDispatchFailed(deleteEmployeeType));
        }
    };

/** @EMPLOYEE_CREATE */
const createEmployeeType = EReduxType.EMPLOYEE_CREATE;
export const createEmployeeApi =
    (formData: FormData) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.CREATE();

        dispatch(isDispatchCalling(createEmployeeType));

        const { response } = await apiCall({
            ...api,
            payload: formData,
        });

        if (response) {
            dispatch(isDispatchSuccess(createEmployeeType));
        } else {
            dispatch(isDispatchFailed(createEmployeeType));
        }
    };

/** @EMPLOYEE_UPDATE */
const updateEmployeeType = EReduxType.EMPLOYEE_UPDATE;
export const updateEmployeeApi =
    (id: string, formData: FormData) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.UPDATE(id);

        dispatch(isDispatchCalling(updateEmployeeType));

        const { response } = await apiCall({
            ...api,
            payload: formData,
        });

        if (response) {
            dispatch(isDispatchSuccess(updateEmployeeType));
        } else {
            dispatch(isDispatchFailed(updateEmployeeType));
        }
    };

/** @EMPLOYEE_RESET_PASSWORD */
const resetEmployeePwType = EReduxType.EMPLOYEE_RESET_PASSWORD;
export const resetEmployeePwApi =
    (id: string, password: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.EMPLOYEE.RESET_PASSWORD();

        dispatch(isDispatchCalling(resetEmployeePwType));

        const { response } = await apiCall({
            ...api,
            payload: {
                id,
                password,
            },
        });

        if (response) {
            dispatch(isDispatchSuccess(resetEmployeePwType));
        } else {
            dispatch(isDispatchFailed(resetEmployeePwType));
        }
    };
