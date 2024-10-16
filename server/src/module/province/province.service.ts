import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { THIRD_PARTY_OPEN_PROVINCE } from '../../common/constant/router-third-party';
import { thirdPartyConfig } from '../../config/third-party';
import { InternalServer } from '../../shared/exception/error.exception';
import {
    GetDistrictCodeParams,
    GetProvinceCodeParams,
    GetWardCodeParams,
    ListDistrictQuery,
    ListWardQuery,
    SearchDistrictQuery,
    SearchProvinceQuery,
    SearchWardQuery,
} from './dto/province-get.dto';

@Injectable()
export class ProvinceService {
    constructor(private readonly httpService: HttpService) {}

    createRequest<T>(method: string, url: string) {
        return this.httpService
            .request<T>({
                method,
                url,
                baseURL: thirdPartyConfig.openProvince,
            })
            .pipe(map(response => response.data));
    }

    /** @PROVINCE */
    async listProvince() {
        const request = this.createRequest('get', THIRD_PARTY_OPEN_PROVINCE.LIST_PROVINCE);
        try {
            const items = await firstValueFrom(request);
            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async searchProvince(query: SearchProvinceQuery) {
        const { q } = query;
        const request = this.createRequest('get', THIRD_PARTY_OPEN_PROVINCE.SEARCH_PROVINCE + `?q=${q}`);
        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async getProvince(param: GetProvinceCodeParams) {
        const { code } = param;
        const request = this.createRequest(
            'get',
            THIRD_PARTY_OPEN_PROVINCE.GET_PROVINCE.replace(':code', code.toString()),
        );
        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    /** @DISTRICT */
    async listDistrict(body: ListDistrictQuery) {
        const { p } = body;
        const request = this.createRequest<any[]>('get', THIRD_PARTY_OPEN_PROVINCE.LIST_DISTRICT);
        try {
            const items = await firstValueFrom(request);

            const itemsOfProvince = items.filter(item => item.province_code === p);

            return itemsOfProvince;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async searchDistrict(query: SearchDistrictQuery) {
        const { q, p } = query;
        const request = this.createRequest(
            'get',
            THIRD_PARTY_OPEN_PROVINCE.SEARCH_DISTRICT + `?q=${q}` + p ? `&p=${p}` : '',
        );
        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async getDistrict(param: GetDistrictCodeParams) {
        const { code } = param;
        const request = this.createRequest(
            'get',
            THIRD_PARTY_OPEN_PROVINCE.GET_DISTRICT.replace(':code', code.toString()),
        );

        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    /** @WARD */
    async listWard(body: ListWardQuery) {
        const { d } = body;
        const request = this.createRequest<any[]>('get', THIRD_PARTY_OPEN_PROVINCE.LIST_WARD);
        try {
            const items = await firstValueFrom(request);

            const itemsOfDistrict = items.filter(item => item.district_code === d);

            return itemsOfDistrict;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async searchWard(query: SearchWardQuery) {
        const { q, p, d } = query;
        const request = this.createRequest(
            'get',
            THIRD_PARTY_OPEN_PROVINCE.SEARCH_WARD + `?q=${q}` + p ? `&p=${p}` : '' + d ? `&d=${d}` : '',
        );
        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }

    async getWard(param: GetWardCodeParams) {
        const { code } = param;
        const request = this.createRequest('get', THIRD_PARTY_OPEN_PROVINCE.GET_WARD.replace(':code', code.toString()));
        try {
            const items = await firstValueFrom(request);

            return items;
        } catch (err) {
            throw new InternalServer();
        }
    }
}
