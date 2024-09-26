import { Injectable } from '@nestjs/common';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { FindProductBaseAdminDto, FindProductBaseDto } from '../../product-base/dto/product-base-get.dto';
import { ProductBaseService } from '../../product-base/service/product-base.service';
import { ProductDetailService } from '../../product-detail/product-detail.service';
import { ProductTypesService } from '../../product-types/product-types.service';
import { CreateProductDto } from '../dto/product-create.dto';
import { UpdateProductDto } from '../dto/product-update.dto';

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

    async clientDetail(id: string) {
        const productBaseDetail = await this.productBaseService.detail(id);
        return productBaseDetail;
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

        let sameSku = false;
        types.types.reduce(
            (acc: Record<string, number>, curr) => {
                if (curr.sku) {
                    if (acc[curr.sku]) {
                        acc[curr.sku] = acc[curr.sku] + 1;
                        sameSku = true;
                    } else acc[curr.sku] = 1;
                }
                return acc;
            },
            base.sku ? { [base.sku]: 1 } : {},
        );
        if (sameSku) {
            throw new BadRequest({ message: DataErrorCodeEnum.SAME_SKU });
        }

        const savedProduct = await this.productBaseService.save(userId, employeeId, base);

        const [savedTypes, savedDetails] = await Promise.all([
            this.productTypesService.saveList(userId, employeeId, { productId: savedProduct.id, ...types }),
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

        let sameSku = false;
        types.types.reduce(
            (acc: Record<string, number>, curr) => {
                if (curr.sku) {
                    if (acc[curr.sku]) {
                        acc[curr.sku] = acc[curr.sku] + 1;
                        sameSku = true;
                    } else acc[curr.sku] = 1;
                }
                return acc;
            },
            base.sku ? { [base.sku]: 1 } : {},
        );
        if (sameSku) {
            throw new BadRequest({ message: DataErrorCodeEnum.SAME_SKU });
        }

        const savedProduct = await this.productBaseService.update(userId, employeeId, productId, base);

        const [savedTypes, savedDetails] = await Promise.all([
            this.productTypesService.updateList(userId, employeeId, { productId, ...types }),
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