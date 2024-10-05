import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IApiOrganizationList,
    IOrganization,
    IOrganizationCreate,
    IOrganizationDetail,
    IOrganizationListResponse,
    IOrganizationUpdate,
} from "@/interface/api/organization.interface";
import { IActionDedicateOrganization } from "@/interface/redux/organization.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ORGANIZATION_LIST */
const organizationListType = EReduxType.ORGANIZATION_LIST;
export const organizationList =
    (body: IApiOrganizationList) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.LIST();

        dispatch(isDispatchCalling(organizationListType));

        const { response } = await apiCall<IOrganizationListResponse>({
            ...api,
            payload: body,
        });

        if (response) {
            const { page, limit, count, items } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateOrganization>(
                    organizationListType,
                    {
                        page,
                        limit,
                        count,
                        items,
                    }
                )
            );
        } else dispatch(isDispatchFailed(organizationListType));
    };

/** @ORGANIZATION_DETAIL */
const organizationDetailType = EReduxType.ORGANIZATION_DETAIL;
export const organizationDetail =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.DETAIL(id);

        dispatch(isDispatchCalling(organizationDetailType));

        const { response } = await apiCall<IOrganizationDetail>({
            ...api,
        });

        if (response) {
            const detail = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateOrganization>(
                    organizationDetailType,
                    {
                        detail,
                    }
                )
            );
        } else dispatch(isDispatchFailed(organizationDetailType));
    };

/** @ORGANIZATION_CREATE */
const organizationCreateType = EReduxType.ORGANIZATION_CREATE;
export const organizationCreate =
    (body: IOrganizationCreate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.CREATE();

        dispatch(isDispatchCalling(organizationCreateType));

        const { response } = await apiCall({
            ...api,
            payload: body,
        });

        if (response) {
            dispatch(isDispatchSuccess(organizationCreateType));
        } else dispatch(isDispatchFailed(organizationCreateType));
    };

/** @ORGANIZATION_UPDATE */
const organizationUpdateType = EReduxType.ORGANIZATION_UPDATE;
export const organizationUpdate =
    (body: IOrganizationUpdate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.UPDATE();

        dispatch(isDispatchCalling(organizationUpdateType));

        const { response } = await apiCall({
            ...api,
            payload: body,
        });

        if (response) {
            dispatch(isDispatchSuccess(organizationUpdateType));
        } else dispatch(isDispatchFailed(organizationUpdateType));
    };

/** @ORGANIZATION_DELETE */
const organizationDeleteType = EReduxType.ORGANIZATION_DELETE;
export const organizationDelete =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.DELETE(id);

        dispatch(isDispatchCalling(organizationDeleteType));

        const { response } = await apiCall({
            ...api,
        });

        if (response) {
            dispatch(isDispatchSuccess(organizationDeleteType));
        } else dispatch(isDispatchFailed(organizationDeleteType));
    };

/** @ORGANIZATION_SELECT_SHOW */
const organizationSelectShowType = EReduxType.ORGANIZATION_UPDATE;
export const organizationSelectShow =
    (id: string, show: boolean) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.ORGANIZATON.SELECT_SHOW();

        dispatch(isDispatchCalling(organizationSelectShowType));

        const { response } = await apiCall({
            ...api,
            payload: {
                organizationId: id,
                show,
            },
        });

        if (response) {
            dispatch(isDispatchSuccess(organizationSelectShowType));
        } else dispatch(isDispatchFailed(organizationSelectShowType));
    };

/** @ORGANIZATION_CURRENT */
const organizationCurrentType = EReduxType.ORGANIZATION_CURRENT;
export const organizationCurrent = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.ORGANIZATON.CURRENT();

    dispatch(isDispatchCalling(organizationCurrentType));

    const { response } = await apiCall<IOrganization | null>({
        ...api,
    });

    if (response) {
        dispatch(
            isDispatchSuccess<IActionDedicateOrganization>(
                organizationCurrentType,
                {
                    current: response.result,
                }
            )
        );
    } else dispatch(isDispatchFailed(organizationCurrentType));
};
