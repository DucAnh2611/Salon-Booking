import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IFindProduct,
    IProductCreate,
    IProductInfo,
    IProductUpdate,
} from "@/interface/api/product.interface";
import { IActionDedicateProduct } from "@/interface/redux/product.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @PRODUCT_LIST */
const listProductType = EReduxType.PRODUCT_LIST;
export const listProductApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.PRODUCT.LIST(page, limit, key, orderBy);

        dispatch(isDispatchCalling(listProductType));

        const { response } = await apiCall<IFindProduct>({ ...api });

        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateProduct>(listProductType, {
                    ...pagination,
                    products: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(listProductType));
        }
    };

/** @PRODUCT_DETAIL */
const detailProductType = EReduxType.PRODUCT_DETAIL;
export const detailProductApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.PRODUCT.DETAIL(id);

        dispatch(isDispatchCalling(detailProductType));

        const { response } = await apiCall<IProductInfo>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateProduct>(detailProductType, {
                    detail: response.result,
                })
            );
        } else {
            dispatch(isDispatchFailed(detailProductType));
        }
    };

/** @PRODUCT_LIST_PARAM */
const listProductListParamType = EReduxType.PRODUCT_LIST_PARAM;
export const setListProductParam =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateProduct>(
                listProductListParamType,
                {
                    page,
                    limit,
                    key,
                    orderBy,
                }
            )
        );
    };
/** @PRODUCT_CREATE */
const createProductType = EReduxType.PRODUCT_CREATE;
export const createProductApi =
    (payload: IProductCreate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.PRODUCT.CREATE();

        dispatch(isDispatchCalling(createProductType));

        const { response } = await apiCall<IFindProduct>({ ...api, payload });

        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateProduct>(createProductType, {
                    ...pagination,
                    products: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(createProductType));
        }
    };

/** @PRODUCT_UPDATE */
const updateProductType = EReduxType.PRODUCT_UPDATE;
export const updateProductApi =
    (payload: IProductUpdate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.PRODUCT.UPDATE();

        dispatch(isDispatchCalling(updateProductType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(updateProductType));
        } else {
            dispatch(isDispatchFailed(updateProductType));
        }
    };

/** @PRODUCT_DELETE_LIST */
const listDeleteProductType = EReduxType.PRODUCT_DELETE_LIST;
export const setListDeleteProductApi =
    (ids: string[]) => (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateProduct>(listDeleteProductType, {
                deleteItems: ids,
            })
        );
    };

/** @PRODUCT_DELETE */
const deleteProductType = EReduxType.PRODUCT_DELETE;
export const deleteProductApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.PRODUCT.DELETE();

        dispatch(isDispatchCalling(deleteProductType));

        const { response } = await apiCall({ ...api, payload: { ids: ids } });

        if (response) {
            dispatch(isDispatchSuccess(deleteProductType));
        } else {
            dispatch(isDispatchFailed(deleteProductType));
        }
    };
