"use server";
import { COOKIE } from "@/constant/cookie.constant";
import { cookies } from "next/headers";

export async function isAuthenticated() {
    const accessToken = cookies().get(COOKIE.accessToken)?.value;

    const isAuthenticated = !!accessToken;

    return isAuthenticated;
}

export async function canRefresh() {
    const refreshToken = cookies().get(COOKIE.refreshToken)?.value;
    const canRefresh = !!refreshToken;

    return canRefresh;
}
