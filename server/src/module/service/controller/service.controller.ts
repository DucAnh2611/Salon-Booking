import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CLIENT_SERVICE_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { FindServiceBaseDto } from '../../service-base/dto/service-base-get.dto';
import { GetServiceParamDto } from '../dto/service-get.dto';
import { ServiceService } from '../service/service.service';

@Controller(ROUTER.SERVICE_CLIENT)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Get(CLIENT_SERVICE_ROUTE.FEATURED)
    feature() {
        return this.serviceService.feature();
    }

    @Get(CLIENT_SERVICE_ROUTE.DETAIL)
    detail(@Param() param: GetServiceParamDto) {
        const { id } = param;
        return this.serviceService.detail(id);
    }

    @Get(CLIENT_SERVICE_ROUTE.RELATED)
    related(@Param() param: GetServiceParamDto) {
        const { id } = param;
        return this.serviceService.related(id);
    }

    @Post(CLIENT_SERVICE_ROUTE.FIND)
    find(@Body() body: FindServiceBaseDto) {
        return this.serviceService.find(body);
    }
}
