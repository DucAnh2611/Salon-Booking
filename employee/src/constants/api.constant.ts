import { EFileType } from "@/enum/media.enum";
import { EOrderType } from "@/enum/order.enum";
import { joinString } from "@/utils/string";

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

export const API_URLS = {
    AUTH: {
        ME: () => ({
            method: "GET",
            headers: HEADERS.header(),
            endPoint: "employee/me",
            withCredentials: true,
        }),
        LOGIN: () => ({
            method: "POST",
            headers: HEADERS.header(),
            endPoint: "auth/emp-login",
            withCredentials: true,
        }),
        REFRESH_TOKEN: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: "auth/emp-refresh-token",
            withCredentials: true,
        }),
        LOGOUT: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: "auth/logout-emp",
            withCredentials: true,
        }),
    },
    CATEGORY: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `category/find?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.header_form(),
            endPoint: `category`,
            withCredentials: true,
        }),
        UPDATE: (id: string) => ({
            method: "PUT",
            headers: HEADERS.header_form(),
            endPoint: `category/${id}`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `category`,
            withCredentials: true,
        }),
    },
    MEDIA: {
        LIST: (
            page = 1,
            limit = 10,
            key = "",
            orderBy = "",
            type: EFileType | null
        ) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `media/find?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}${
                type ? `&type=${type}` : ""
            }`,
            withCredentials: true,
        }),
        UPLOADS: () => ({
            method: "POST",
            headers: HEADERS.header_form(),
            endPoint: `media/upload`,
            withCredentials: true,
        }),
        UPDATE: (id: string) => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `media/${id}`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `media`,
            withCredentials: true,
        }),
        TEMP_UPLOAD: () => ({
            method: "POST",
            headers: HEADERS.header_form(),
            endPoint: `media/temp-upload`,
            withCredentials: true,
        }),
    },
    PERMISSION: {
        LIST: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `permission/all`,
            withCredentials: true,
        }),
    },
    ROLE: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `role?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `role/${id}`,
            withCredentials: true,
        }),
        UPDATE: (id: string) => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `role/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `role`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `role`,
            withCredentials: true,
        }),
    },
    CLIENT: {
        LIST: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `client-staff/list`,
            withCredentials: true,
        }),
        UPDATE_LOCK: () => ({
            method: "Put",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `client-staff/lock`,
            withCredentials: true,
        }),
    },
    EMPLOYEE: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `employee/find?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `employee/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.header_form(),
            endPoint: `employee`,
            withCredentials: true,
        }),
        UPDATE: (id: string) => ({
            method: "PUT",
            headers: HEADERS.header_form(),
            endPoint: `employee/${id}`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `employee`,
            withCredentials: true,
        }),
        RESET_PASSWORD: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `employee/reset-password`,
            withCredentials: true,
        }),
    },
    ATTRIBUTE: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `attribute/find?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.header_form(),
            endPoint: `attribute`,
            withCredentials: true,
        }),
    },
    PRODUCT: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `product?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `product/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `product`,
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `product`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `product`,
            withCredentials: true,
        }),
    },
    SERVICE: {
        LIST: (page = 1, limit = 10, key = "", orderBy = "") => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `service?limit=${limit}&page=${page}&key=${key}&orderBy=${orderBy}`,
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `service/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `service`,
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `service`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `service`,
            withCredentials: true,
        }),
    },
    WORKING_HOUR: {
        RANGE: (from: string, end: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour?fromDate=${from}&endDate=${end}`,
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour/info/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour`,
            withCredentials: true,
        }),
        TOGGLE_OFF: (date: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour/toggle-off?date=${date}`,
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `working-hour`,
            withCredentials: true,
        }),
    },
    SHIFT: {
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift/${id}`,
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift`,
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift`,
            withCredentials: true,
        }),
        DELETE: (id: string) => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift/${id}`,
            withCredentials: true,
        }),
    },
    SHIFT_ASSIGNMENT: {
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift-employee`,
            withCredentials: true,
        }),
        DELETE: () => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: `shift-employee/many`,
            withCredentials: true,
        }),
    },
    ORDER: {
        LIST: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff"],
            }),
            withCredentials: true,
        }),
    },
    ORDER_PRODUCT: {
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id],
            }),
            withCredentials: true,
        }),
        STATE: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id, "states"],
            }),
            withCredentials: true,
        }),
        REFUND: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id, "refunds"],
            }),
            withCredentials: true,
        }),
        TRANSACTION: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id, "transactions"],
            }),
            withCredentials: true,
        }),
        PRODUCT: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id, "products"],
            }),
            withCredentials: true,
        }),
        SERVICE: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "d", id, "services"],
            }),
            withCredentials: true,
        }),
    },
    ORDER_STATE: {
        LIST: (type: EOrderType) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-state", `list?type=${type}`],
            }),
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-state"],
            }),
            withCredentials: true,
        }),
        CANCEL_KEEP_FEE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-state", "cancel-keep-fee"],
            }),
            withCredentials: true,
        }),
    },
    REFUND: {
        GET: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-refund", id],
            }),
            withCredentials: true,
        }),
        CHECK: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-refund", "recheck", id],
            }),
            withCredentials: true,
        }),
        APPROVE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-refund", "approve"],
            }),
            withCredentials: true,
        }),
        DECLINE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-refund", "decline"],
            }),
            withCredentials: true,
        }),
        GET_PAYMENT_QR: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "order-refund", "create-qr", id],
            }),
            withCredentials: true,
        }),
    },
    STATISTIC: {
        DASHBOARD: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["statistic-admin", "dashboard"],
            }),
            withCredentials: true,
        }),
    },
    ORGANIZATON: {
        LIST: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin", "list"],
            }),
            withCredentials: true,
        }),
        DETAIL: (id: string) => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin", id],
            }),
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin"],
            }),
            withCredentials: true,
        }),
        CREATE: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin"],
            }),
            withCredentials: true,
        }),
        DELETE: (id: string) => ({
            method: "DELETE",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin", id],
            }),
            withCredentials: true,
        }),
        SELECT_SHOW: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin", "show"],
            }),
            withCredentials: true,
        }),
        CURRENT: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["organization-admin", "current"],
            }),
            withCredentials: true,
        }),
    },
    JOB: {
        MY_JOB: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["order", "staff", "job", "me"],
            }),
            withCredentials: true,
        }),
    },
    SETTING: {
        GET: () => ({
            method: "GET",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["setting"],
            }),
            withCredentials: true,
        }),
        RESET: () => ({
            method: "POST",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["setting", "reset"],
            }),
            withCredentials: true,
        }),
        UPDATE: () => ({
            method: "PUT",
            headers: HEADERS.DEFAULT_HEADER,
            endPoint: joinString({
                joinString: "/",
                strings: ["setting"],
            }),
            withCredentials: true,
        }),
    },
};
