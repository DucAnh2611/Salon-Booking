import { LOCALSTORAGE } from "@/constant/str.constant";

export const localStorageSet = <T>(value: T) => {
    localStorage.setItem(LOCALSTORAGE, JSON.stringify(value));
};

export const localStorageGet = <T>() => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(LOCALSTORAGE) || "{}";
        return JSON.parse(value) as T;
    }
};

export const localStorageClear = () => {
    localStorage.removeItem(LOCALSTORAGE);
};
