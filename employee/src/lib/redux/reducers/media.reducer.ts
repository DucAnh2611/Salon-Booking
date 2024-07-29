import { EReduxType } from "@/enum/type-redux.enum";
import {
    isCallingApi,
    isFailedApiCall,
    isSuccessfulApiCall,
} from "@/helpers/actionDedecate";
import { IDispatchDedicateRedux } from "@/interface/redux/dedicate.interface";
import {
    IActionDedicateMedia,
    IInitialStateMedia,
} from "@/interface/redux/media.interface";

const initialState: IInitialStateMedia = {
    medias: [],
    deleteItems: [],
    page: 1,
    limit: 20,
    count: 0,
    key: "",
    typeMedia: null,
    orderBy: "d_createdAt",
    isCalling: false,
    isCreating: false,
    isDeleting: false,
    isFailure: false,
    isUpdating: false,
    reload: false,
};

export const mediaReducer = (
    state = initialState,
    action: IDispatchDedicateRedux & IActionDedicateMedia
): IInitialStateMedia => {
    switch (action.type) {
        case EReduxType.MEDIA_LIST_PARAM:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    page: action.page || state.page,
                    limit: action.limit || state.limit,
                    key: action.key !== undefined ? action.key : state.key,
                    typeMedia:
                        action.typeMedia !== undefined
                            ? action.typeMedia
                            : state.typeMedia,
                    orderBy:
                        action.orderBy !== undefined
                            ? action.orderBy
                            : state.orderBy,
                };
            }
            return state;

        case EReduxType.MEDIA_LIST:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCalling: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    isCalling: false,
                    isFailure: false,
                    deleteItems: [],
                    medias: action.medias || state.medias,
                    count: action.count || state.count,
                    reload: false,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isCalling: false,
                    isFailure: true,
                    reload: false,
                };
            }
            return state;

        case EReduxType.MEDIA_UPDATE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isUpdating: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    page: 1,
                    isUpdating: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isUpdating: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.MEDIA_DELETE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isDeleting: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    page: 1,
                    deleteItems: [],
                    isDeleting: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isDeleting: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.MEDIA_CREATE:
            if (isCallingApi(action)) {
                return {
                    ...state,
                    isCreating: true,
                    isFailure: false,
                };
            }
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    page: 1,
                    isCreating: false,
                    isFailure: false,
                    reload: true,
                };
            }
            if (isFailedApiCall(action)) {
                return {
                    ...state,
                    isCreating: false,
                    isFailure: true,
                };
            }
            return state;

        case EReduxType.MEDIA_DELETE_LIST:
            if (isSuccessfulApiCall(action)) {
                return {
                    ...state,
                    deleteItems: action.deleteItems || [],
                    isCreating: false,
                    isFailure: false,
                };
            }
            return state;

        default:
            return state;
    }
};
