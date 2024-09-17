import { Injectable } from '@nestjs/common';
import { ProductBaseClientService } from '../../product-base/service/product-base-client.service';
import { ProductDetailService } from '../../product-detail/product-detail.service';
import { ProductTypesService } from '../../product-types/product-types.service';
import { GetProductInStockQueryDto } from '../dto/product-get.dto';

@Injectable()
export class ProductClientService {
    constructor(
        private readonly productBaseClientService: ProductBaseClientService,
        private readonly productDetailService: ProductDetailService,
        private readonly productTypesService: ProductTypesService,
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
