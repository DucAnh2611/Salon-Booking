import { EFileType } from "@/enum/media.enum";

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
};
