import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateAttributeValueDto } from './dto/attribute-value-create.dto';
import { UpdateTypeAttributeValueDto } from './dto/type-attribute-value-update.dto';
import { AttributeValueEntity } from './entity/attribute-value.entity';
import { SavedAttributeValueWithTemp } from './interface/attribute-value-create.interface';

@Injectable()
export class AttributeValueService {
    constructor(
        @InjectRepository(AttributeValueEntity)
        private readonly attributeValueRepository: Repository<AttributeValueEntity>,
    ) {}

    getInsertList(ids: string[]) {
        return this.attributeValueRepository.find({ where: { id: In(ids) }, loadEagerRelations: false });
    }

    async createList(list: CreateAttributeValueDto[]) {
        const savedList = await Promise.all(
            list.map(async item => {
                const saved = await this.attributeValueRepository.save({
                    value: item.value,
                    attributeId: item.attributeId,
                });

                return {
                    ...saved,
                    tempId: item.tempId,
                } as SavedAttributeValueWithTemp;
            }),
        );
        return savedList;
    }

    create(body: CreateAttributeValueDto) {
        const { value, attributeId } = body;

        return this.attributeValueRepository.save({
            value,
            attributeId,
        });
    }

    async update(body: UpdateTypeAttributeValueDto) {
        const { id, value } = body;

        const isExist = await this.attributeValueRepository.findOne({ where: { id }, loadEagerRelations: false });
        if (!isExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXISTE_TYPE_ATTRIBUTE_VALUE });
        }

        await this.attributeValueRepository.update(
            { id },
            {
                value: value,
            },
        );
        return DataSuccessCodeEnum.OK;
    }
}
