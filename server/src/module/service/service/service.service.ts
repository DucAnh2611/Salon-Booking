import { Injectable } from '@nestjs/common';
import { FindServiceBaseDto } from '../../service-base/dto/service-base-get.dto';
import { ServiceBaseService } from '../../service-base/service-base.service';

@Injectable()
export class ServiceService {
    constructor(private readonly serviceBaseService: ServiceBaseService) {}

    find(body: FindServiceBaseDto) {
        return this.serviceBaseService.findClient(body);
    }

    feature() {
        return this.serviceBaseService.feature();
    }

    detail(id: string) {
        return this.serviceBaseService.detailClient(id);
    }
}
