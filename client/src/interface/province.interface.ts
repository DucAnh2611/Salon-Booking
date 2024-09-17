export interface IProvinceBase {
    code: number;
    name: string;
}

export interface IDistrictBase {
    code: number;
    name: string;
}

export interface IWardBase {
    code: number;
    name: string;
}

export interface IProvince extends IProvinceBase {
    division_type: string;
    codename: string;
    phone_code: number;
    districts: IDistrict[];
}

export interface IProvinceSearch extends IProvinceBase {
    matches: Record<string, number[]>;
}

export interface IDistrict extends IDistrictBase {
    division_type: string;
    codename: string;
    province_code: number;
    wards: IWard[];
}

export interface IDistrictSearch extends IDistrictBase {
    matches: Record<string, number[]>;
}

export interface IWard extends IWardBase {
    division_type: string;
    codename: string;
    province_code: number;
}

export interface IWardSearch extends IWardBase {
    matches: Record<string, number[]>;
}

export interface IProvinceSearchQuery {
    q: string;
}

export interface IDistrictSearchQuery {
    q: string;
    p?: number;
}

export interface IWardSearchQuery {
    q: string;
    p?: number;
    d?: number;
}

export interface IDistrictListQuery {
    p: number;
}

export interface IWardListQuery {
    d: number;
}
