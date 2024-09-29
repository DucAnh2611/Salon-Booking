import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/category.service';
import { ProductBaseClientService } from '../../product-base/service/product-base-client.service';
import { ProductDetailService } from '../../product-detail/product-detail.service';
import { ProductTypesService } from '../../product-types/product-types.service';
import { ServiceBaseService } from '../../service-base/service-base.service';
import { GetProductInStockQueryDto } from '../dto/product-get.dto';

@Injectable()
export class ProductClientService {
    constructor(
        private readonly productBaseClientService: ProductBaseClientService,
        private readonly ServiceBaseService: ServiceBaseService,
        private readonly productDetailService: ProductDetailService,
        private readonly productTypesService: ProductTypesService,
        private readonly categoryService: CategoryService,
    ) {}

    async detail(id: string) {
        const base = await this.productBaseClientService.detail(id);

        const detail = await this.productDetailService.getByProduct(id);

        const types = await this.productTypesService.getTypesForProduct(id);

        return {
            base,
            detail,
            types,
        };
    }

    async relatedProduct(productId: string) {
        const product = await this.productBaseClientService.isValid(productId);

        const relatedCategory = await this.categoryService.getRelatedCategory(product.categoryId);

        const products = await this.productBaseClientService.relatedProduct(
            relatedCategory.map(c => c.id),
            product.id,
        );

        const services = await this.ServiceBaseService.related(relatedCategory.map(c => c.id));

        return {
            products,
            services,
        };
    }

    featured() {
        return this.productBaseClientService.featured();
    }

    onStock(query: GetProductInStockQueryDto) {
        const { productId, typeId } = query;

        if (typeId) {
            return this.productTypesService.inStock(typeId);
        }

        return this.productBaseClientService.inStock(productId);
    }
}
