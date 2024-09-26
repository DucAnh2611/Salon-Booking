import { API_URLS } from "@/constant/api.constant";
import {
    IApiAddProductCart,
    IApiAddServiceCart,
    IApiCartProductAmount,
    IApiCartServiceAmount,
    IApiUpdateProductCart,
    ICartProduct,
    ICartProductAmount,
    ICartService,
} from "@/interface/cart.interface";
import { apiCall } from "../apiCall";

/** @GET_CART_PRODUCT */
export const getProductCart = async () => {
    const api = API_URLS.CART.GET_PRODUCT();

    const resApi = await apiCall<ICartProduct>({ ...api });

    return resApi;
};

/** @GET_CART_PRODUCT_AMOUNT */
export const getProductCartAmount = async (body: IApiCartProductAmount) => {
    const api = API_URLS.CART.GET_PRODUCT_AMOUNT();

    const resApi = await apiCall<ICartProductAmount>({ ...api, payload: body });

    return resApi;
};

/** @ADD_TO_CART_PRODUCT */
export const addProductCart = async (body: IApiAddProductCart) => {
    const api = API_URLS.CART.ADD_PRODUCT();

    const resApi = await apiCall({ ...api, payload: body });

    return resApi;
};

/**  @UPDATE_CART_PRODUCT */
export const updateProductCart = async (body: IApiUpdateProductCart) => {
    const api = API_URLS.CART.UPDATE_PRODUCT();

    const resApi = await apiCall({ ...api, payload: body });

    return resApi;
};

/**  @DELETE_CART_PRODUCT */
export const deleteProductCart = async (id: string) => {
    const api = API_URLS.CART.DELETE_PRODUCT(id);

    const resApi = await apiCall({ ...api });

    return resApi;
};

/** @ADD_TO_CART_SERVICE */
export const addServiceCart = async (body: IApiAddServiceCart) => {
    const api = API_URLS.CART.ADD_SERVICE();

    const resApi = await apiCall({ ...api, payload: body });

    return resApi;
};

/** @GET_CART_PRODUCT */
export const getServiceCart = async () => {
    const api = API_URLS.CART.GET_SERVICE();

    const resApi = await apiCall<ICartService>({ ...api });

    return resApi;
};

/** @GET_CART_SERVICE_AMOUNT */
export const getServiceCartAmount = async (body: IApiCartServiceAmount) => {
    const api = API_URLS.CART.GET_SERVICE_AMOUNT();

    const resApi = await apiCall<ICartProductAmount>({ ...api, payload: body });

    return resApi;
};

/**  @DELETE_CART_PRODUCT */
export const deleteServiceCart = async (id: string) => {
    const api = API_URLS.CART.DELETE_SERVICE(id);

    const resApi = await apiCall({ ...api });

    return resApi;
};
