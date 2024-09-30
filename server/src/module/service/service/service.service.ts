import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/category.service';
import { ProductBaseClientService } from '../../product-base/service/product-base-client.service';
import { FindServiceBaseDto } from '../../service-base/dto/service-base-get.dto';
import { ServiceBaseService } from '../../service-base/service-base.service';

@Injectable()
export class ServiceService {
    constructor(
        private readonly serviceBaseService: ServiceBaseService,
        private readonly productBaseClientService: ProductBaseClientService,
        private readonly categoryService: CategoryService,
    ) {}

    find(body: FindServiceBaseDto) {
        return this.serviceBaseService.findClient(body);
    }

    feature() {
        return this.serviceBaseService.feature();
    }

    detail(id: string) {
        return this.serviceBaseService.detailClient(id);
    }

    async related(id: string) {
        const service = await this.serviceBaseService.isValid(id);

        const relatedCategory = await this.categoryService.getRelatedCategory(service.categoryId);

        const services = await this.serviceBaseService.related(
            relatedCategory.map(c => c.id),
            service.id,
        );

        const products = await this.productBaseClientService.relatedProduct(relatedCategory.map(c => c.id));

        return {
            services,
            products,
        };
    }
}
