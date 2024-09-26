import { Controller, Get, Param, Query } from '@nestjs/common';
import { PROVINCE_ROUTE, ROUTER } from '../../common/constant/router.constant';
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
import { ProvinceService } from './province.service';

@Controller(ROUTER.PROVINCE)
export class ProvinceController {
    constructor(private readonly provinceService: ProvinceService) {}

    /** @PROVINCE */
    @Get(PROVINCE_ROUTE.LIST_PROVINCE)
    listProvince() {
        return this.provinceService.listProvince();
    }

    @Get(PROVINCE_ROUTE.SEARCH_PROVINCE)
    searchProvince(@Query() query: SearchProvinceQuery) {
        return this.provinceService.searchProvince(query);
    }

    @Get(PROVINCE_ROUTE.GET_PROVINCE)
    getProvince(@Param() param: GetProvinceCodeParams) {
        return this.provinceService.getProvince(param);
    }

    /** @DISTRICT */
    @Get(PROVINCE_ROUTE.LIST_DISTRICT)
    listDistrict(@Query() query: ListDistrictQuery) {
        return this.provinceService.listDistrict(query);
    }

    @Get(PROVINCE_ROUTE.SEARCH_DISTRICT)
    searchDistrict(@Query() query: SearchDistrictQuery) {
        return this.provinceService.searchDistrict(query);
    }

    @Get(PROVINCE_ROUTE.GET_DISTRICT)
    getDistrict(@Param() param: GetDistrictCodeParams) {
        return this.provinceService.getDistrict(param);
    }

    /** @WARD */
    @Get(PROVINCE_ROUTE.LIST_WARD)
    listWard(@Query() query: ListWardQuery) {
        return this.provinceService.listWard(query);
    }

    @Get(PROVINCE_ROUTE.SEARCH_WARD)
    searchWard(@Query() query: SearchWardQuery) {
        return this.provinceService.searchWard(query);
    }

    @Get(PROVINCE_ROUTE.GET_WARD)
    getWard(@Param() param: GetWardCodeParams) {
        return this.provinceService.getWard(param);
    }
}
