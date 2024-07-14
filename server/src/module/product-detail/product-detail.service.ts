import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ProductBaseService } from '../product-base/product-base.service';
import { CreateProductDetailDto, ProductDetailDto } from './dto/product-detail-create.dto';
import { ProductDetailExistDto, UpdateProductDetailDto } from './dto/product-detail-update.dto';
import { ProductDetailEntity } from './entity/product-detail.entity';

@Injectable()
export class ProductDetailService {
    constructor(
        @InjectRepository(ProductDetailEntity)
        private readonly productDetailRepository: Repository<ProductDetailEntity>,
        private readonly productBaseService: ProductBaseService,
    ) {}

    isExistByKey(key: string, productId: string) {
        return this.productDetailRepository.findOne({ where: { key, productId }, loadEagerRelations: false });
    }

    async isExist(id: string) {
        const existKey = await this.productDetailRepository.findOne({ where: { id }, loadEagerRelations: false });

        if (!existKey) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_DETAIL_KEY });
        }

        return existKey;
    }

    async isValid(productId: string, key: string) {
        const [validProduct, existKey] = await Promise.all([
            this.productBaseService.isValid(productId),
            this.isExistByKey(key, productId),
        ]);

        if (!validProduct) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        return existKey;
    }

    async saveMany(body: CreateProductDetailDto) {
        const { details, productId } = body;

        await Promise.all(details.map(detail => this.save(productId, detail)));
        return DataSuccessCodeEnum.OK;
    }

    async save(productId: string, detail: ProductDetailDto) {
        const { key, value } = detail;

        const detailInstance = this.productDetailRepository.create({
            key,
            value,
            productId,
        });

        const created = await this.productDetailRepository.save(detailInstance);

        return created;
    }

    async updateList(body: UpdateProductDetailDto) {
        const { productId, details } = body;
        if (details.length === 0) {
            await this.productDetailRepository.delete({ productId });
            return DataSuccessCodeEnum.OK;
        }

        const listDetail = await this.productDetailRepository.find({ where: { productId }, loadEagerRelations: false });

        const [updateList, deleteList, createList] = await Promise.all([
            Promise.all(details.map(detail => this.update(detail))),
            Promise.all(listDetail.filter(d => !details.find(dt => d.id === dt.id)).map(d => this.deleteOne(d.id))),
            this.saveMany({
                productId,
                details: details.filter(d => !d.id).map(d => ({ key: d.key, value: d.value })),
            }),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async update(detail: ProductDetailExistDto) {
        const { id, key, value } = detail;

        const existKey = await this.isExist(id);
        if (!existKey) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_DETAIL_KEY });
        }

        const newKey = this.productDetailRepository.create({
            ...existKey,
            key,
            value,
        });

        return this.productDetailRepository.save(newKey);
    }

    async deleteOne(id: string) {
        await this.isExist(id);

        await this.productDetailRepository.delete({ id });

        return DataSuccessCodeEnum.OK;
    }
}
