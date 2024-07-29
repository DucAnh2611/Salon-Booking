import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { ICategory, IFindCategory } from "@/interface/api/category.interface";
import { IActionDedicateCategory } from "@/interface/redux/category.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @CATEGORY_LIST */
const categoryListType = EReduxType.CATEGORY_LIST;
export const listCategoryApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.CATEGORY.LIST(page, limit, key, orderBy);

        dispatch(
            isDispatchCalling<IActionDedicateCategory>(categoryListType, {
                page,
                limit,
                key,
                orderBy,
            })
        );
        const { response, error } = await apiCall<IFindCategory>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateCategory>(
                    categoryListType,
                    response.result
                )
            );
        } else {
            dispatch(
                isDispatchFailed<IActionDedicateCategory>(categoryListType)
            );
        }
    };

/** @CATEGORY_CREATE */
const categoryCreateType = EReduxType.CATEGORY_CREATE;
export const createCategoryApi =
    (formData: FormData) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.CATEGORY.CREATE();

        dispatch(
            isDispatchCalling<IActionDedicateCategory>(categoryCreateType)
        );
        const { response, error } = await apiCall<ICategory>({
            ...api,
            payload: formData,
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateCategory>(categoryCreateType)
            );
        } else {
            dispatch(
                isDispatchFailed<IActionDedicateCategory>(categoryCreateType)
            );
        }
    };

/** @CATEGORY_UPDATE */
const categoryUpdateType = EReduxType.CATEGORY_UPDATE;
export const updateCategoryApi =
    (id: string, formData: FormData) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.CATEGORY.UPDATE(id);

        dispatch(
            isDispatchCalling<IActionDedicateCategory>(categoryUpdateType)
        );
        const { response, error } = await apiCall<string>({
            ...api,
            payload: formData,
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateCategory>(categoryUpdateType)
            );
        } else {
            dispatch(
                isDispatchFailed<IActionDedicateCategory>(categoryUpdateType)
            );
        }
    };

/** @CATEGORY_DELETE_LIST */
const setDeleteCategoryType = EReduxType.CATEGORY_DELETE_LIST;
export const setDeleteCategoryApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateCategory>(setDeleteCategoryType, {
                deleteItems: ids,
            })
        );
    };

/** @CATEGORY_DELETE */
const categoryDeleteType = EReduxType.CATEGORY_DELETE;
export const deleteCategoryApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.CATEGORY.DELETE();

        dispatch(
            isDispatchCalling<IActionDedicateCategory>(categoryDeleteType)
        );

        const { response, error } = await apiCall({
            ...api,
            payload: { ids },
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateCategory>(categoryDeleteType)
            );
        } else
            dispatch(
                isDispatchFailed<IActionDedicateCategory>(categoryDeleteType)
            );
    };
