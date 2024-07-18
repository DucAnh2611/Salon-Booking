import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { ParseOrderString } from '../../shared/utils/parse-dynamic-queyry.utils';
import { MediaEntity } from '../media/entity/media.entity';
import { MediaTypesEnum } from '../media/enum/media-types.enum';
import { CreateCategoryDto } from './dto/category-create.dto';
import { FindCategoryAdminDto, FindCategoryDto } from './dto/category-get.dto';
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

    async findAdmin(query: FindCategoryAdminDto) {
        const { page, limit, key, orderBy } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.ASC };

        const findCategory = await this.categoryRepository.find({
            where: {
                title: Like(`%${key || ''}%`),
            },
            skip: (page - 1) * limit,
            loadEagerRelations: false,
            relations: {
                userCreate: {
                    userBase: true,
                },
                userUpdate: {
                    userBase: true,
                },
            },
            order: { ...order },
        });

        const count = await this.categoryRepository.count({
            where: { title: Like(`%${key || ''}%`) },
            loadEagerRelations: false,
        });

        return { limit, page, items: findCategory, count };
    }

    async find(query: FindCategoryDto) {
        const { key } = query;

        const findCategory = await this.categoryRepository.find({
            where: {
                title: Like(`%${key || ''}%`),
            },
            loadEagerRelations: false,
            order: {
                createdAt: SortByEnum.DESC,
            },
        });

        return findCategory;
    }

    async create(employeeId: string, body: CreateCategoryDto) {
        const { title, imageId, parentId } = body;

        let checkParentCategory = null;
        if (parentId) {
            checkParentCategory = await this.categoryRepository.findOne({
                where: { id: parentId },
                loadEagerRelations: false,
            });

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
            level: (checkParentCategory?.level || 0) + 1,
            imageId,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.categoryRepository.save(categoryInstance);
    }

    async update(employeeId: string, categoryId: string, body: UpdateCategoryDto) {
        const isExist = await this.isExist(categoryId, 'id');
        const { imageId, parentId } = body;

        let checkParentCategory = null;
        if (parentId) {
            checkParentCategory = await this.categoryRepository.findOne({
                where: { id: parentId },
                loadEagerRelations: false,
            });

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
            level: (checkParentCategory?.level || 0) + 1,
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
