import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IFindRole,
    IRoleCreateRedux,
    IRoleDetail,
    IRoleUpdate,
} from "@/interface/api/role.interface";
import { IActionDedicateRole } from "@/interface/redux/role.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ROLE_LIST */
const listRoleType = EReduxType.ROLE_LIST;
export const listRoleApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.ROLE.LIST(page, limit, key, orderBy);

        dispatch(isDispatchCalling(listRoleType));

        const { response } = await apiCall<IFindRole>({ ...api });
        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateRole>(listRoleType, {
                    ...pagination,
                    roles: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(listRoleType));
        }
    };

/** @ROLE_DETAIL */
const detailRoleType = EReduxType.ROLE_DETAIL;
export const detailRoleApi = (id: string) => async (dispatch: TAppDispatch) => {
    const api = API_URLS.ROLE.DETAIL(id);

    dispatch(isDispatchCalling(detailRoleType));

    const { response } = await apiCall<IRoleDetail>({ ...api });

    if (response) {
        dispatch(
            isDispatchSuccess<IActionDedicateRole>(detailRoleType, {
                detail: response.result,
            })
        );
    } else {
        dispatch(isDispatchFailed(detailRoleType));
    }
};

/** @ROLE_UPDATE */
const updateRoleType = EReduxType.ROLE_UPDATE;
export const updateRoleApi =
    (roleId: string, payload: IRoleUpdate) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.ROLE.UPDATE(roleId);

        dispatch(isDispatchCalling(updateRoleType));

        const { response } = await apiCall<string>({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(updateRoleType));
        } else {
            dispatch(isDispatchFailed(updateRoleType));
        }
    };

/** @ROLE_CREATE */
const createRoleType = EReduxType.ROLE_CREATE;
export const createRoleApi =
    (payload: IRoleCreateRedux) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ROLE.CREATE();

        dispatch(isDispatchCalling(createRoleType));

        const { response } = await apiCall<string>({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(createRoleType));
        } else {
            dispatch(isDispatchFailed(createRoleType));
        }
    };

/** @ROLE_DELETE_LIST */
const setDeleteListRoleType = EReduxType.ROLE_DELETE_LIST;
export const setDeleteListRoleApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateRole>(setDeleteListRoleType, {
                deleteItems: ids,
            })
        );
    };

/** @ROLE_DELETE */
const deleteRoleType = EReduxType.ROLE_DELETE;
export const deleteRoleApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ROLE.DELETE();

        dispatch(isDispatchCalling(deleteRoleType));

        const { response } = await apiCall<string>({
            ...api,
            payload: { roleIds: ids },
        });

        if (response) {
            dispatch(isDispatchSuccess(deleteRoleType));
        } else {
            dispatch(isDispatchFailed(deleteRoleType));
        }
    };
