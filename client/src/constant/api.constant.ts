import {
    IDistrictListQuery,
    IDistrictSearchQuery,
    IProvinceSearchQuery,
    IWardListQuery,
    IWardSearchQuery,
} from "@/interface/province.interface";
import {
    IApiCancelTransaction,
    IApiSuccessTransaction,
} from "@/interface/transaction.interface";
import { joinString } from "@/lib/string";

const HEADERS = {
    DEFAULT_HEADER: {
        "Content-Type": "application/json; charset=UTF-8",
    },
    header: () => ({
        "Content-Type": "application/json; charset=UTF-8",
    }),
    header_form: () => ({
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }),
    jsonHeader: () => ({
        "Content-Type": "application/json; charset=UTF-8",
    }),
    file_header: () => ({
        "Content-Type": "multipart/form-data",
    }),
};

export const API = {
    api_base_url: process.env.NEXT_PUBLIC_BACKEND_HOST || "",
    api_prefix: process.env.NEXT_PUBLIC_BACKEND_PREFIX || "",
};

export const API_URLS = {
    AUTH: {
        ME: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: "client/me",
            withCredentials: true,
        }),
        LOGIN: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: "auth/client-login",
            withCredentials: true,
        }),
        REGISTER: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: "auth/client-register",
            withCredentials: true,
        }),
        REFRESH_TOKEN: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: "auth/refresh-token",
            withCredentials: true,
        }),
        LOGOUT: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: "auth/logout",
            withCredentials: true,
        }),
    },
    PRODUCT: {
        FEATURED: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: "product/client/feature",
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product", "client", "i", id],
            }),
            withCredentials: true,
        }),
        ON_STOCK: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product", "client", "on-stock"],
            }),
            withCredentials: true,
        }),
    },
    CART: {
        GET_PRODUCT: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-product", "me"],
            }),
            withCredentials: true,
        }),
        GET_PRODUCT_AMOUNT: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-product", "amount"],
            }),
            withCredentials: true,
        }),
        ADD_PRODUCT: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-product"],
            }),
            withCredentials: true,
        }),
        UPDATE_PRODUCT: () => ({
            method: "PUT",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-product"],
            }),
            withCredentials: true,
        }),
        DELETE_PRODUCT: (id: string) => ({
            method: "DELETE",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-product", id],
            }),
            withCredentials: true,
        }),
    },
    ORDER: {
        TRACKING: (code: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", code],
            }),
            withCredentials: true,
        }),
        TRACKING_STATE: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", id, "states"],
            }),
            withCredentials: true,
        }),
        TRACKING_REFUND: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", id, "refunds"],
            }),
            withCredentials: true,
        }),
        TRACKING_TRANSACTION: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", id, "transactions"],
            }),
            withCredentials: true,
        }),
        TRACKING_PRODUCT: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", id, "products"],
            }),
            withCredentials: true,
        }),
        TRACKING_SERVICE: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "tracking", id, "services"],
            }),
            withCredentials: true,
        }),
        SEARCH: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "search"],
            }),
            withCredentials: true,
        }),
        PLACE_PRODUCT: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "place", "product"],
            }),
            withCredentials: true,
        }),
    },
    PROVINCE: {
        LIST_PROVINCE: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", "list-province"],
            }),
            withCredentials: true,
        }),
        SEARCH_PROVINCE: ({ q }: IProvinceSearchQuery) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", `search-province?q=${q}`],
            }),
            withCredentials: true,
        }),
        GET_PROVINCE: (code: number) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", "get-province", code.toString()],
            }),
            withCredentials: true,
        }),

        LIST_DISTRICT: ({ p }: IDistrictListQuery) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", `list-district?p=${p}`],
            }),
            withCredentials: true,
        }),
        SEARCH_DISTRICT: ({ q, p }: IDistrictSearchQuery) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "province",
                    `search-district?q=${q}${p ? `&p=${p}` : ""}`,
                ],
            }),
            withCredentials: true,
        }),
        GET_DISTRICT: (code: number) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", "get-district", code.toString()],
            }),
            withCredentials: true,
        }),

        LIST_WARD: ({ d }: IWardListQuery) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", `list-ward?d=${d}`],
            }),
            withCredentials: true,
        }),
        SEARCH_WARD: ({ q, p, d }: IWardSearchQuery) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "province",
                    `search-ward?q=${q}${p ? `&p=${p}` : ""}${
                        d ? `&d=${d}` : ""
                    }`,
                ],
            }),
            withCredentials: true,
        }),
        GET_WARD: (code: number) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["province", "get-ward", code.toString()],
            }),
            withCredentials: true,
        }),
    },
    TRANSACTION: {
        GET_LINK_PRODUCT: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", id, "product", "payment"],
            }),
            withCredentials: true,
        }),
        CANCEL: (
            orderId: string,
            { code, id, orderCode, status }: IApiCancelTransaction
        ) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "order",
                    orderId,
                    "transaction",
                    "fail" +
                        `?code=${code}&cancel=true&id=${id}&orderCode=${orderCode}&status=${status}`,
                ],
            }),
            withCredentials: true,
        }),
        SUCCESS: (
            orderId: string,
            { code, id, orderCode, status }: IApiSuccessTransaction
        ) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "order",
                    orderId,
                    "transaction",
                    "success" +
                        `?code=${code}&cancel=false&id=${id}&orderCode=${orderCode}&status=${status}`,
                ],
            }),
            withCredentials: true,
        }),
    },
    BANK: {
        LIST: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["bank", "banks"],
            }),
            withCredentials: true,
        }),
        QUICK_QR: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["bank", "quick-qr"],
            }),
            withCredentials: true,
        }),
    },
    REFUND: {
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "refund"],
            }),
            withCredentials: true,
        }),
        CONFIRM_RECEIVED: (requestId: string) => ({
            method: "PUT",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "refund", requestId, "received"],
            }),
            withCredentials: true,
        }),
    },
};
