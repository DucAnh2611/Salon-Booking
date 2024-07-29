import { Injectable } from '@nestjs/common';
import { FindProductBaseAdminDto, FindProductBaseDto } from '../product-base/dto/product-base-get.dto';
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

    async detail(id: string) {
        const productBaseDetail = await this.productBaseService.detail(id);

        const productDetail = await this.productDetailService.getByProduct(id);

        const productTypes = await this.productTypesService.getTypesForProduct(id);

        return {
            base: productBaseDetail,
            details: productDetail,
            types: productTypes,
        };
    }

    async findAdmin(query: FindProductBaseAdminDto) {
        const productList = await this.productBaseService.findAdmin(query);

        return productList;
    }

    async find(query: FindProductBaseDto) {
        const productList = await this.productBaseService.find(query);

        return productList;
    }

    async create(userId: string, employeeId: string, body: CreateProductDto) {
        const { base, details, types } = body;
        const savedProduct = await this.productBaseService.save(userId, employeeId, base);

        const [savedTypes, savedDetails] = await Promise.all([
            this.productTypesService.saveList(userId, employeeId, { productId: savedProduct.id, productTypes: types }),
            this.productDetailService.saveMany({ details, productId: savedProduct.id }),
        ]);

        return {
            ...savedProduct,
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
            ...savedProduct,
            productTypes: savedTypes,
            details: savedDetails,
        };
    }

    async delete(ids: string[]) {
        return this.productBaseService.deleteMany({ ids });
    }
}
