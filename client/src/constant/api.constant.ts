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
    },
};
