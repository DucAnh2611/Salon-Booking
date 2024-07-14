import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { AttributeService } from '../attribute/attribute.service';
import { ProductBaseService } from '../product-base/product-base.service';
import { CreateProductTypesAttributeDto } from '../product-types-attribute/dto/product-types-attribute-create.dto';
import { ProductTypesAttributeService } from '../product-types-attribute/product-types-attribute.service';
import { CreateProductTypesDto, ProductTypesDto } from './dto/product-types-create.dto';
import { ProductTypesExistDto, UpdateProductTypesDto } from './dto/product-types-update.dto';
import { ProductTypesEntity } from './entity/product-types.entity';

@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        private readonly attributeService: AttributeService,
        private readonly productBaseService: ProductBaseService,
        private readonly productTypesAttributeService: ProductTypesAttributeService,
    ) {}
    isValid(id: string) {
        return this.productTypesRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    isExistBySku(sku: string) {
        return this.productTypesRepository.findOneBy({ sku });
    }

    listByProductId(id: string) {
        return this.productTypesRepository.find({ where: { productId: id }, loadEagerRelations: false });
    }

    isMatchTypes(oldTypes: ProductTypesEntity[], newAttrIds: string[]) {
        let match = true;
        for (const type of oldTypes) {
            const { productTypesAttribute } = type;
            const attrIds = productTypesAttribute.map(attr => attr.attributeId);

            const setAttrTypes = new Set([...newAttrIds, attrIds]);
            const arrSet = Array.from(setAttrTypes);

            if (arrSet.length !== attrIds.length) {
                match = false;
            }
        }

        return match;
    }

    async deleteTypeBeforeInsert(productId: string) {
        const listTypes = await this.listByProductId(productId);

        return this.productTypesRepository.softDelete({ id: In(listTypes.map(type => type.id)) });
    }

    async saveList(userId: string, employeeId: string, body: CreateProductTypesDto) {
        const { productTypes, productId } = body;

        const deleteTypes = await this.deleteTypeBeforeInsert(productId);

        return Promise.all(productTypes.map(productType => this.save(userId, employeeId, productId, productType)));
    }

    async save(userId: string, employeeId: string, productId: string, productType: ProductTypesDto) {
        const { price, quantity, sku, types } = productType;

        const typeInstance = this.productTypesRepository.create({
            price,
            quantity,
            productId,
            sku,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        const savedProductTypes = await this.productTypesRepository.save(typeInstance);

        const listTypesAttribute: CreateProductTypesAttributeDto[] = [];

        if (types.length > 1) {
            const isValids = await Promise.all(types.map(type => this.attributeService.isValid(type.attrId)));
            if (!isValids) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ATTRIBUTE });
            }
            isValids.forEach((attr, i) => {
                const type = types.find(t => t.attrId === attr.id);

                listTypesAttribute.push({
                    ...type,
                    productTypesId: savedProductTypes.id,
                });
            });
        } else {
            const [attr] = types;
            const isValid = await this.attributeService.isValid(attr.attrId);
            if (!isValid) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ATTRIBUTE });
            }

            listTypesAttribute.push({
                ...attr,
                productTypesId: savedProductTypes.id,
            });
        }

        const saveProductTypesAttributes = await this.productTypesAttributeService.saveMany(
            userId,
            productId,
            listTypesAttribute,
        );

        return { ...savedProductTypes, productTypeAttribute: saveProductTypesAttributes };
    }

    async updateList(userId: string, employeeId: string, body: UpdateProductTypesDto) {
        const { productTypes, productId } = body;

        const listTypes = await this.listByProductId(productId);
        const bodyTypesById = productTypes.reduce((acc: ProductTypesExistDto[], curr) => {
            if (curr.productTypesId) {
                acc.push(curr);
            }
            return acc;
        }, []);

        const existList: ProductTypesExistDto[] = productTypes.filter(t => !!t.productTypesId);

        const deleteList = listTypes.reduce((acc: ProductTypesEntity[], curr) => {
            const find = bodyTypesById.find(t => t.productTypesId);
            if (!find) {
                acc.push(curr);
            }
            return acc;
        }, []);
        const [softDeleteList, createList, updateList] = await Promise.all([
            Promise.all(deleteList.map(type => this.archive(type.id))),
            this.saveList(userId, employeeId, {
                productId,
                productTypes: productTypes.filter(t => !t.productTypesId),
            }),
            Promise.all(existList.map(productType => this.update(userId, employeeId, productId, productType))),
        ]);

        return this.productTypesRepository.find({
            where: { productId },
            loadEagerRelations: false,
            relations: { productTypesAttribute: true, userCreate: false, userUpdate: false },
        });
    }

    async update(userId: string, employeeId: string, productId: string, producType: ProductTypesExistDto) {
        const { types, productTypesId, ...props } = producType;
        const { sku } = props;

        const valid = await this.isValid(productTypesId);
        if (!valid) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_TYPE });
        }

        const typeInstance = this.productTypesRepository.create({
            ...valid,
            ...props,
            updatedBy: employeeId,
        });

        if (sku) {
            const skuTypeExist = await this.isExistBySku(sku);
            if (skuTypeExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_PRODUCT_TYPE });
            }
            const skuProductExist = await this.productBaseService.findBySku(sku);

            if (skuProductExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_PRODUCT });
            }

            typeInstance.sku = sku;
        }

        await this.productTypesAttributeService.saveMany(
            userId,
            productId,
            types.map(type => ({ ...type, productTypesId }) as CreateProductTypesAttributeDto),
        );

        return this.productTypesRepository.save(typeInstance);
    }

    async archive(productTypeId: string) {
        await this.productTypesRepository.softDelete({ id: productTypeId });
        return DataSuccessCodeEnum.OK;
    }
}
