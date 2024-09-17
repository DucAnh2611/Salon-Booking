import { ILayoutProps } from "@/interface/layout.interface";
import {
    IDistrict,
    IDistrictListQuery,
    IDistrictSearchQuery,
    IProvince,
    IProvinceSearchQuery,
    IWard,
    IWardListQuery,
    IWardSearchQuery,
} from "@/interface/province.interface";
import {
    listDistrict,
    listProvince,
    listWard,
} from "@/lib/actions/province.actions";
import { createContext, useEffect, useState } from "react";

interface IProvinceContext {
    provinces: IProvince[];
    search: IProvinceSearchQuery;
    selected: IProvince | null;
    loading: boolean;
}

interface IDistrictContext {
    districts: IDistrict[];
    search: IDistrictSearchQuery;
    selected: IDistrict | null;
    loading: boolean;
}

interface IWardContext {
    wards: IWard[];
    search: IWardSearchQuery;
    selected: IWard | null;
    loading: boolean;
}

interface IProvinceContextProps {
    province: IProvinceContext;
    district: IDistrictContext;
    ward: IWardContext;
    street: string;
    setSelected: <T extends TSearchType>(
        type: T,
        selected: TSelectParam<T>
    ) => void;
    setStreet: (st: string) => void;
}

type TSearchType = "d" | "p" | "w";

type TSelectParam<T extends TSearchType> = T extends "d"
    ? IDistrict
    : T extends "p"
    ? IProvince
    : IWard | null;

export const ProvinceContext = createContext<IProvinceContextProps>({
    province: {
        provinces: [],
        search: {
            q: "",
        },
        selected: null,
        loading: false,
    },
    district: {
        districts: [],
        search: {
            q: "",
        },
        selected: null,
        loading: false,
    },
    ward: {
        wards: [],
        search: {
            q: "",
        },
        selected: null,
        loading: false,
    },
    street: "",
    setSelected: <T extends TSearchType>(
        type: T,
        selected: TSelectParam<T>
    ) => {},
    setStreet: (st: string) => {},
});

export default function ProvinceProvider({ children }: ILayoutProps) {
    const [province, SetProvince] = useState<IProvinceContext>({
        provinces: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
    });
    const [district, SetDistrict] = useState<IDistrictContext>({
        districts: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
    });
    const [ward, SetWard] = useState<IWardContext>({
        wards: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
    });
    const [street, SetStreet] = useState<string>("");

    const getProvinceList = async () => {
        SetProvince((p) => ({
            ...p,
            selected: null,
            loading: true,
        }));
        SetDistrict((d) => ({ ...d, selected: null }));
        SetWard((w) => ({ ...w, selected: null }));
        SetStreet("");

        const { response } = await listProvince();
        if (response) {
            SetProvince((p) => ({
                ...p,
                provinces: response.result,
                loading: false,
            }));
        }
    };

    const getDistrictList = async (query: IDistrictListQuery) => {
        SetDistrict((p) => ({
            ...p,
            selected: null,
            loading: true,
        }));
        SetWard((w) => ({ ...w, selected: null }));
        SetStreet("");

        const { response } = await listDistrict(query);
        if (response) {
            SetDistrict((p) => ({
                ...p,
                districts: response.result,
                loading: false,
            }));
        }
    };

    const getWardList = async (query: IWardListQuery) => {
        SetWard((p) => ({ ...p, loading: true, selected: null }));
        SetStreet("");

        const { response } = await listWard(query);
        if (response) {
            SetWard((p) => ({
                ...p,
                wards: response.result,
                loading: false,
            }));
        }
    };

    const setSelected = async <T extends TSearchType>(
        type: T,
        selected: TSelectParam<T>
    ) => {
        switch (type) {
            case "p":
                SetProvince((p) => ({
                    ...p,
                    selected: selected as IProvince | null,
                }));
                if (selected) {
                    await getDistrictList({ p: selected.code });
                }
                break;
            case "d":
                SetDistrict((p) => ({
                    ...p,
                    selected: selected as IDistrict | null,
                }));
                if (selected) {
                    await getWardList({ d: selected.code });
                }
                break;
            case "w":
                SetWard((p) => ({
                    ...p,
                    selected: selected as IWard | null,
                }));
                break;
            default:
                return;
        }
    };

    const setStreet = (st: string) => {
        SetStreet(st);
    };

    useEffect(() => {
        getProvinceList();
    }, []);

    return (
        <ProvinceContext.Provider
            value={{ province, district, ward, street, setStreet, setSelected }}
        >
            {children}
        </ProvinceContext.Provider>
    );
}
