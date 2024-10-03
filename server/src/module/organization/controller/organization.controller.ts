import { Controller, Get } from '@nestjs/common';
import { ORGANIZATION_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { OrganizationService } from '../service/organization.service';

@Controller(ROUTER.ORGANIZATION)
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Get(ORGANIZATION_ROUTE.CURRENT)
    current() {
        return this.organizationService.current();
    }
}
