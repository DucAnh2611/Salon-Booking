import { Injectable } from '@nestjs/common';
import { ProductBaseService } from '../product-base/product-base.service';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { ProductTypesService } from '../product-types/product-types.service';
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-update.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly productBaseService: ProductBaseService,
        private readonly productDetailService: ProductDetailService,
        private readonly productTypesService: ProductTypesService,
    ) {}

    async create(userId: string, employeeId: string, body: CreateProductDto) {
        const { base, details, types } = body;
        const savedProduct = await this.productBaseService.save(userId, employeeId, base);

        const [savedTypes, savedDetails] = await Promise.all([
            this.productTypesService.saveList(userId, employeeId, { productId: savedProduct.id, productTypes: types }),
            this.productDetailService.saveMany({ details, productId: savedProduct.id }),
        ]);

        return {
            ...savedTypes,
            productTypes: savedTypes,
            details: savedDetails,
        };
    }

    async update(userId: string, employeeId: string, body: UpdateProductDto) {
        const { base, details, types, productId } = body;

        const savedProduct = await this.productBaseService.update(userId, employeeId, productId, base);

        const [savedTypes, savedDetails] = await Promise.all([
            this.productTypesService.updateList(userId, employeeId, { productId, productTypes: types }),
            this.productDetailService.updateList({ details, productId }),
        ]);

        return {
            ...savedTypes,
            productTypes: savedTypes,
            details: savedDetails,
        };
    }
}
