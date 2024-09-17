import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { CategoryService } from '../../category/category.service';
import { MediaService } from '../../media/service/media.service';
import { ProductMediaService } from '../../product-media/product-media.service';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';
import { ProductBaseEntity } from '../entity/product-base.entity';

@Injectable()
export class ProductBaseClientService {
    constructor(
        @InjectRepository(ProductBaseEntity) private readonly productBaseRepository: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        private readonly categoryService: CategoryService,
        private readonly mediaService: MediaService,
        private readonly productMediaService: ProductMediaService,
    ) {}

    isValid(id: string) {
        return this.productBaseRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    featured() {
        return this.productBaseRepository.find({
            where: {},
            loadEagerRelations: false,
            take: 5,
            skip: 0,
            order: { createdAt: SortByEnum.DESC },
            relations: {
                types: true,
                productMedia: {
                    media: true,
                },
            },
        });
    }

    async inStock(id: string) {
        const product = await this.isValid(id);

        if (!product) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT });
        }

        return { quantity: product.quantity };
    }

    async detail(id: string) {
        const productBase = await this.productBaseRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                category: {
                    image: true,
                },
                productDetail: true,
                productMedia: true,
                types: {
                    productTypesAttribute: {
                        thumbnail: true,
                        value: true,
                    },
                },
            },
            loadEagerRelations: false,
        });

        return productBase;
    }
}
