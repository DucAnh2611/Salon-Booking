import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { DynamicQuery } from '../../common/type/query.type';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { ParseDynamicQuery } from '../../shared/utils/parse-dynamic-queyry.utils';
import { MediaEntity } from '../media/entity/media.entity';
import { MediaTypesEnum } from '../media/enum/media-types.enum';
import { CreateCategoryDto } from './dto/category-create.dto';
import { UpdateCategoryDto } from './dto/category-update.dto';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    ) {}

    async isExist(value: string, type: 'title' | 'id') {
        let query = {};

        switch (type) {
            case 'title':
                query = { title: value };
                break;
            case 'id':
                query = { id: value };
                break;
            default:
                return;
        }

        return this.categoryRepository.findOne({ where: query, loadEagerRelations: false });
    }

    async find(query: DynamicQuery) {
        const { filter, limit, page, sort } = ParseDynamicQuery(query);

        const findCategory = await this.categoryRepository.find({
            where: filter,
            skip: (page - 1) * limit,
            order: sort,
        });

        return findCategory;
    }

    async create(employeeId: string, body: CreateCategoryDto) {
        const { title, imageId, level, parentId } = body;

        if (parentId) {
            const checkParentCategory = await this.categoryRepository.count({ where: { id: parentId } });

            if (!checkParentCategory) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
            }
        }

        if (imageId) {
            const checkImage = await this.mediaRepository.count({ where: { id: imageId, type: MediaTypesEnum.IMAGE } });

            if (!checkImage) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
        }

        const categoryInstance = this.categoryRepository.create({
            parentId,
            title,
            level,
            imageId,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.categoryRepository.save(categoryInstance);
    }

    async update(employeeId: string, categoryId: string, body: UpdateCategoryDto) {
        const isExist = await this.isExist(categoryId, 'id');
        const { title = isExist.title, imageId, level = isExist.level, parentId } = body;

        if (parentId && parentId !== isExist.parentId) {
            const checkParentCategory = await this.categoryRepository.count({ where: { id: parentId } });

            if (!checkParentCategory) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
            }
        }

        if (imageId && imageId !== isExist.imageId) {
            const checkImage = await this.mediaRepository.count({ where: { id: imageId, type: MediaTypesEnum.IMAGE } });

            if (!checkImage) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
        }

        return this.categoryRepository.save({
            ...isExist,
            updatedBy: employeeId,
            ...body,
        });
    }

    async delete(employeeId: string, categoryId: string) {
        const isExist = await this.isExist(categoryId, 'id');

        const updateDeletedEmp = await this.categoryRepository.softDelete(categoryId);

        if (updateDeletedEmp.affected !== 1) {
            throw new InternalServer();
        }

        return DataSuccessCodeEnum.OK;
    }

    async deleteMany(employeeId: string, categoryIds: string[]) {
        const resDelete = await Promise.all(categoryIds.map(categoryId => this.delete(employeeId, categoryId)));

        return resDelete;
    }
}
