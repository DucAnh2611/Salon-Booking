import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import rootReducer from "./reducers";

export const store = configureStore({
    reducer: rootReducer,
});

export type AppStore = typeof store;

export type TRootState = ReturnType<typeof store.getState>;

export type TAppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();

export const useAppSelector = useSelector.withTypes<TRootState>();

export const useAppStore = useStore.withTypes<AppStore>();
