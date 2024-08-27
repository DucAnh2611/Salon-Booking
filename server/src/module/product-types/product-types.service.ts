import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { AttributeValueService } from '../attribute-value/attribute-value.service';
import { CreateAttributeValueDto } from '../attribute-value/dto/attribute-value-create.dto';
import { SavedAttributeValueWithTemp } from '../attribute-value/interface/attribute-value-create.interface';
import { ProductBaseService } from '../product-base/product-base.service';
import { CreateProductTypesAttributeDto } from '../product-types-attribute/dto/product-types-attribute-create.dto';
import { UpdateProductTypesAttributeDto } from '../product-types-attribute/dto/product-types-attribute-update.dto';
import { ProductTypesAttributeService } from '../product-types-attribute/product-types-attribute.service';
import { LevelSelectAttributeValueCreateDto } from '../product/dto/product-create.dto';
import { LevelSelectAttributeValueUpdateDto } from '../product/dto/product-update.dto';
import { CreateProductTypesBodyDto, CreateProductTypesDto } from './dto/product-types-create.dto';
import { UpdateProductTypesBodyDto, UpdateProductTypesDto } from './dto/product-types-update.dto';
import { ProductTypesEntity } from './entity/product-types.entity';

@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductTypesEntity) private readonly productTypesRepository: Repository<ProductTypesEntity>,
        private readonly productBaseService: ProductBaseService,
        private readonly productTypesAttributeService: ProductTypesAttributeService,
        private readonly attributeValueService: AttributeValueService,
    ) {}

    async getTypesForProduct(productId: string) {
        const list = await this.productTypesRepository.find({ where: { productId }, loadEagerRelations: false });
        const mapTypesAttribute = await Promise.all(
            list.map(async item => {
                const typesAttr = await this.productTypesAttributeService.getAttributeDetailForType(item.id);
                return {
                    ...item,
                    productTypesAttribute: typesAttr,
                };
            }),
        );

        return mapTypesAttribute;
    }

    isValid(id: string) {
        return this.productTypesRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async isExistBySku(sku: string) {
        const [productBySku, typeBySku] = await Promise.all([
            this.productTypesRepository.findOne({ where: { sku }, loadEagerRelations: false }),
            this.productBaseService.findBySku(sku),
        ]);
        return productBySku || typeBySku;
    }

    async inStock(id: string) {
        const type = await this.isValid(id);

        if (!type) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_PRODUCT_TYPE });
        }

        return type.quantity;
    }

    listByProductId(id: string) {
        return this.productTypesRepository.find({ where: { productId: id }, loadEagerRelations: false });
    }

    async deleteTypeBeforeInsert(productId: string) {
        const listTypes = await this.listByProductId(productId);

        return this.productTypesRepository.softDelete({ id: In(listTypes.map(type => type.id)) });
    }

    async saveList(userId: string, employeeId: string, body: CreateProductTypesBodyDto) {
        const { productId, types, selectAttribute } = body;
        if (!types.length || !selectAttribute.first) {
            return [];
        }

        //Step1: insert Attribute Value and map with TempId
        const attributeValues = Object.values(selectAttribute).reduce(
            (acc: CreateAttributeValueDto[], level: LevelSelectAttributeValueCreateDto) => {
                if (level.attribute)
                    acc = [...acc, ...level.value.map(value => ({ attributeId: level.attribute.id, ...value }))];
                return acc;
            },
            [],
        );

        const insertList = await this.attributeValueService.createList(attributeValues);
        //Step2: insert ProductType with id of attributeId by TempId
        return Promise.all(types.map(type => this.save(userId, employeeId, insertList, productId, type)));
    }

    async save(
        userId: string,
        employeeId: string,
        attributeValuesInserted: SavedAttributeValueWithTemp[],
        productId: string,
        productType: CreateProductTypesDto,
    ) {
        const { price, quantity, types, sku } = productType;
        if (sku) {
            const isExistBySku = await this.isExistBySku(sku);
            if (isExistBySku) {
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_PRODUCT_BY_SKU });
            }
        }

        const typeInstance = this.productTypesRepository.create({
            price,
            quantity,
            productId,
            sku,
            createdBy: employeeId,
            updatedBy: employeeId,
        });
        const savedProductTypes = await this.productTypesRepository.save(typeInstance);

        let listTypesAttribute: CreateProductTypesAttributeDto[] = [];
        types.forEach(type => {
            const { value, ...typeInfo } = type;

            const findAttributeValue = attributeValuesInserted.find(attributeValue => {
                if (value.attrValueTempId && attributeValue.tempId)
                    return attributeValue.tempId === value.attrValueTempId;
                if (value.attrValueId && attributeValue.id) return attributeValue.id === value.attrValueId;
                return false;
            });

            if (findAttributeValue) {
                listTypesAttribute = [
                    ...listTypesAttribute.filter(
                        item => item.level !== value.level && item.valueId !== findAttributeValue.id,
                    ),
                    {
                        productTypesId: savedProductTypes.id,
                        level: value.level,
                        valueId: findAttributeValue.id,
                        ...typeInfo,
                    },
                ];
            }
        });

        const saveProductTypesAttributes = await this.productTypesAttributeService.saveMany(
            userId,
            productId,
            listTypesAttribute,
        );

        return { ...savedProductTypes, productTypeAttribute: saveProductTypesAttributes };
    }

    async updateList(userId: string, employeeId: string, body: UpdateProductTypesBodyDto) {
        const { types, selectAttribute, productId } = body;

        const listTypes = await this.listByProductId(productId);

        const existList: UpdateProductTypesDto[] = [];
        const deleteList = [];

        listTypes.forEach(type => {
            const uType = types.find(uType => uType.productTypesId === type.id);
            if (uType) {
                existList.push(uType);
            } else {
                deleteList.push(type);
            }
        });

        //Step2: Create new Attribute
        const attributeValues = Object.values(selectAttribute).reduce(
            (acc: CreateAttributeValueDto[], level: LevelSelectAttributeValueUpdateDto) => {
                if (level.attribute)
                    acc = [
                        ...acc,
                        ...level.value
                            .filter(item => item.tempId && !item.id)
                            .map(value => ({ attributeId: level.attribute.id, tempId: value.tempId, ...value })),
                    ];
                return acc;
            },
            [],
        );

        const insertList = await this.attributeValueService.createList(attributeValues);

        const existInsertList = await this.attributeValueService.getInsertList(
            Object.values(selectAttribute).reduce((acc: string[], level: LevelSelectAttributeValueUpdateDto) => {
                if (level.attribute)
                    acc = [...acc, ...level.value.filter(item => item.id && !item.tempId).map(value => value.id)];
                return acc;
            }, []),
        );

        const [softDeleteList, createList, updateList] = await Promise.all([
            this.productTypesRepository.softDelete({ id: In(deleteList.map(type => type.id)) }),
            Promise.all(
                types
                    .filter(t => !t.productTypesId)
                    .map(({ productTypesId, ...item }) =>
                        this.save(userId, employeeId, [...insertList, ...existInsertList], productId, {
                            ...item,
                            types: item.types.map(t => ({
                                value: {
                                    level: t.value.level,
                                    ...(t.value.attrValueTempId ? { attrValueTempId: t.value.attrValueTempId } : {}),
                                    ...(t.value.attrValueId ? { attrValueId: t.value.attrValueId } : {}),
                                },
                            })),
                        }),
                    ),
            ),
            Promise.all(
                existList.map(productType =>
                    this.update(userId, employeeId, [...insertList, ...existInsertList], productId, productType),
                ),
            ),
        ]);

        return [...createList, ...updateList];
    }

    async update(
        userId: string,
        employeeId: string,
        attributeValuesInserted: SavedAttributeValueWithTemp[],
        productId: string,
        producType: UpdateProductTypesDto,
    ) {
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
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_PRODUCT_BY_SKU });
            }
            typeInstance.sku = sku;
        }

        let listTypesAttribute: UpdateProductTypesAttributeDto[] = [];
        types.forEach(type => {
            const { value, ...typeInfo } = type;

            const findAttributeValue = attributeValuesInserted.find(attributeValue => {
                if (value.attrValueTempId && attributeValue.tempId)
                    return attributeValue.tempId === value.attrValueTempId;
                if (value.attrValueId && attributeValue.id) return attributeValue.id === value.attrValueId;
                return false;
            });

            if (findAttributeValue) {
                listTypesAttribute = [
                    ...listTypesAttribute.filter(
                        item => item.level !== value.level && item.valueId !== findAttributeValue.id,
                    ),
                    {
                        productTypesId,
                        level: value.level,
                        valueId: findAttributeValue.id,
                        ...typeInfo,
                    },
                ];
            }
        });

        await this.productTypesRepository.save(typeInstance);

        await this.productTypesAttributeService.updateMany(userId, productId, listTypesAttribute);

        return DataSuccessCodeEnum.OK;
    }

    async archive(productTypeId: string) {
        await this.productTypesRepository.softDelete({ id: productTypeId });
        return DataSuccessCodeEnum.OK;
    }
}
