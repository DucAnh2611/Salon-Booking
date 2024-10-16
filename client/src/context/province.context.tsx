import { toast } from "@/components/ui/use-toast";
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
    failed: boolean;
}

interface IDistrictContext {
    districts: IDistrict[];
    search: IDistrictSearchQuery;
    selected: IDistrict | null;
    loading: boolean;
    failed: boolean;
}

interface IWardContext {
    wards: IWard[];
    search: IWardSearchQuery;
    selected: IWard | null;
    loading: boolean;
    failed: boolean;
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
    reset: () => void;
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
        failed: false,
    },
    district: {
        districts: [],
        search: {
            q: "",
        },
        selected: null,
        loading: false,
        failed: false,
    },
    ward: {
        wards: [],
        search: {
            q: "",
        },
        selected: null,
        loading: false,
        failed: false,
    },
    street: "",
    setSelected: <T extends TSearchType>(
        type: T,
        selected: TSelectParam<T>
    ) => {},
    setStreet: (st: string) => {},
    reset: () => {},
});

export default function ProvinceProvider({ children }: ILayoutProps) {
    const [province, SetProvince] = useState<IProvinceContext>({
        provinces: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
        failed: false,
    });
    const [district, SetDistrict] = useState<IDistrictContext>({
        districts: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
        failed: false,
    });
    const [ward, SetWard] = useState<IWardContext>({
        wards: [],
        search: {
            q: "",
        },
        loading: false,
        selected: null,
        failed: false,
    });
    const [street, SetStreet] = useState<string>("");

    const reset = () => {
        SetStreet("");
        SetProvince({
            provinces: [],
            search: {
                q: "",
            },
            loading: false,
            selected: null,
            failed: false,
        });
        SetDistrict({
            districts: [],
            search: {
                q: "",
            },
            loading: false,
            selected: null,
            failed: false,
        });
        SetWard({
            wards: [],
            search: {
                q: "",
            },
            loading: false,
            selected: null,
            failed: false,
        });
    };

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
        } else {
            toast({
                title: "Thất bại",
                description: "Lấy thông tin thành phố thất bại.",
                duration: 2000,
                variant: "destructive",
            });
            SetProvince((p) => ({
                ...p,
                failed: true,
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
        } else {
            toast({
                title: "Thất bại",
                description: "Lấy thông tin quận huyện",
                duration: 2000,
                variant: "destructive",
            });
            SetDistrict((p) => ({
                ...p,
                failed: true,
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
        } else {
            toast({
                title: "Thất bại",
                description: "Lấy thông tin phường xã thất bại",
                duration: 2000,
                variant: "destructive",
            });
            SetWard((p) => ({
                ...p,
                failed: true,
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
            value={{
                province,
                district,
                ward,
                street,
                setStreet,
                setSelected,
                reset,
            }}
        >
            {children}
        </ProvinceContext.Provider>
    );
}
