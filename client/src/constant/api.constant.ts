import {
    IDistrictListQuery,
    IDistrictSearchQuery,
    IProvinceSearchQuery,
    IWardListQuery,
    IWardSearchQuery,
} from "@/interface/province.interface";
import {
    IApiFailTransaction,
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
        LOGOUT: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: "auth/logout-client",
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
    },
    CLIENT: {
        VERIFY_EMAIL: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "verify-email"],
            }),
            withCredentials: true,
        }),
        VERIFY_EMAIL_OTP: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "verify-email-otp"],
            }),
            withCredentials: true,
        }),
        INFO: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "me", "i"],
            }),
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.header_form(),
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "me"],
            }),
            withCredentials: true,
        }),
        EXIST: (email: string) => ({
            method: "GET",
            headers: HEADERS.header_form(),
            endPoint: joinString({
                joinString: "/",
                strings: ["client", `exist?email=${email}`],
            }),
        }),
        SEND_RESET_PASSWORD_EMAIL: (email: string) => ({
            method: "GET",
            headers: HEADERS.header_form(),
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "signature", `send?email=${email}`],
            }),
        }),
        CHECK_RESET_PASSWORD_SIGNATURE: (email: string, token: string) => ({
            method: "GET",
            headers: HEADERS.header_form(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "client",
                    "signature",
                    `check?email=${email}&token=${token}`,
                ],
            }),
        }),
        RESET_PASSWORD: () => ({
            method: "PUT",
            headers: HEADERS.header_form(),
            endPoint: joinString({
                joinString: "/",
                strings: ["client", "reset-password"],
            }),
        }),
    },
    CATEGORY: {
        TREE: (parentId?: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: [
                    "category",
                    "client",
                    `tree${parentId ? `?parentId=${parentId}` : " "}`,
                ],
            }),
            withCredentials: true,
        }),
        LIST: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["category", "client", "list"],
            }),
            withCredentials: true,
        }),
    },
    PRODUCT: {
        FEATURED: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: "product-client/feature",
            withCredentials: true,
        }),
        RELATED: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product-client", "related", id],
            }),
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product-client", "i", id],
            }),
            withCredentials: true,
        }),
        ON_STOCK: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product-client", "on-stock"],
            }),
            withCredentials: true,
        }),
        FIND: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["product-client"],
            }),
            withCredentials: true,
        }),
    },
    SERVICE: {
        FEATURED: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["service-client", "feature"],
            }),
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["service-client", "i", id],
            }),
            withCredentials: true,
        }),
        FIND: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["service-client"],
            }),
            withCredentials: true,
        }),
        RELATED: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["service-client", "related", id],
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

        GET_SERVICE: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-service", "me"],
            }),
            withCredentials: true,
        }),
        ADD_SERVICE: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-service"],
            }),
            withCredentials: true,
        }),
        GET_SERVICE_AMOUNT: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-service", "amount"],
            }),
            withCredentials: true,
        }),
        DELETE_SERVICE: (id: string) => ({
            method: "DELETE",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["cart-service", id],
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
        CANCEL: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "cancel"],
            }),
            withCredentials: true,
        }),
        RECEIVE: (id: string) => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", id, "receive"],
            }),
            withCredentials: true,
        }),
        RETURN: (id: string) => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", id, "return"],
            }),
            withCredentials: true,
        }),
        CONFIRM: (id: string) => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "order-service", id, "confirm"],
            }),
            withCredentials: true,
        }),
        PLACE_SERVICE: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "place", "service"],
            }),
            withCredentials: true,
        }),
        EXPIRED_ORDER: (id: string) => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "expired", id],
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
        FAIL: (
            orderId: string,
            { code, id, orderCode, status }: IApiFailTransaction
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
        CANCEL: (orderId: string) => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", orderId, "transaction", "cancel"],
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
        CANCEL: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "refund", "cancel"],
            }),
            withCredentials: true,
        }),
        RECEIVE: (id: string) => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "refund", id, "received"],
            }),
            withCredentials: true,
        }),
    },
    SHIFT: {
        GET_BOOKING_TIME: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["shift", "booking"],
            }),
            withCredentials: true,
        }),
        GET_EMPLOYEE_BOOKING: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["shift-employee", "client", "service-employee"],
            }),
            withCredentials: true,
        }),
        CHECK_OVERLAP_SERVICE_EMPLOYEE: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["shift-employee", "client", "overlap"],
            }),
            withCredentials: true,
        }),
    },
    ORGANIZATION: {
        CURRENT: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: joinString({
                joinString: "/",
                strings: ["organization", "current"],
            }),
            withCredentials: true,
        }),
    },
};
