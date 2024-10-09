import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { ParseOrderString } from '../../shared/utils/parse-dynamic-queyry.utils';
import { MediaEntity } from '../media/entity/media.entity';
import { MediaTypesEnum } from '../media/enum/media-types.enum';
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryTreeDto, FindCategoryAdminDto } from './dto/category-get.dto';
import { UpdateCategoryDto } from './dto/category-update.dto';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    ) {}

    async getAllChildren(ids: string[]): Promise<string[]> {
        const cateIds = await Promise.all(
            ids.map(async id => {
                const child = await this.categoryRepository.find({
                    where: { parentId: id },
                    loadEagerRelations: false,
                });

                const childsIds = await this.getAllChildren(child.map(c => c.id));

                return [id, ...childsIds];
            }),
        );

        return cateIds.length ? cateIds[0] : [];
    }

    async buildCategoryTree(parents: CategoryEntity[]) {
        if (!parents.length) {
            return [];
        }

        const list = await Promise.all(
            parents.map(async parent => {
                const childList = await this.categoryRepository.find({
                    where: {
                        parentId: parent.id,
                    },
                    loadEagerRelations: false,
                    relations: {
                        image: true,
                    },
                });

                const childTree = await this.buildCategoryTree(childList);

                return {
                    ...parent,
                    childrens: childTree,
                };
            }),
        );

        return list;
    }

    async getRelatedCategory(categoryId: string): Promise<CategoryEntity[]> {
        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
            loadEagerRelations: false,
        });

        if (!category.parentId) return [category];

        const parent = await this.getRelatedCategory(category.parentId);

        return [category, ...parent];
    }

    async isNested(id: string, parentId: string) {
        const isNested = await this.categoryRepository.findOne({
            where: {
                id,
            },
            loadEagerRelations: false,
            relations: {
                childrens: true,
            },
        });

        if (!isNested) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CATEGORY });
        }

        if (!isNested.childrens.length) {
            return false;
        }

        if (isNested.childrens.some(cate => cate.id === parentId)) {
            throw new BadRequest({ message: DataErrorCodeEnum.NESTED_CATEGORY });
        }
        await Promise.all(isNested.childrens.map(cate => this.isNested(cate.id, parentId)));

        return false;
    }

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
            take: limit,
            skip: (page - 1) * limit,
            loadEagerRelations: false,
            relations: {
                image: true,
                parent: true,
                userCreate: {
                    userBase: {
                        userAvatar: true,
                    },
                },
                userUpdate: {
                    userBase: {
                        userAvatar: true,
                    },
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

    async tree(body: CategoryTreeDto) {
        const { parentId } = body;
        const findCategory = await this.categoryRepository.find({
            where: {
                parentId: parentId ? parentId : IsNull(),
            },
            loadEagerRelations: false,
            order: {
                createdAt: SortByEnum.ASC,
            },
            relations: {
                image: true,
            },
        });

        const mapCanGetChildren = await Promise.all(
            findCategory.map(async cate => {
                const childrenCount = await this.categoryRepository.count({
                    where: { parentId: cate.id },
                    loadEagerRelations: false,
                });
                return {
                    ...cate,
                    haveChildren: childrenCount !== 0,
                };
            }),
        );

        return mapCanGetChildren;
    }

    async list() {
        const findCategory = await this.categoryRepository.find({
            where: {},
            loadEagerRelations: false,
            order: {
                createdAt: SortByEnum.DESC,
            },
            relations: {
                image: true,
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
            if (parentId === categoryId) {
                throw new BadRequest({ message: DataErrorCodeEnum.SELF_LINK_CATEGORY });
            }
            await this.isNested(categoryId, parentId);
        }

        if (imageId && imageId !== isExist.imageId) {
            const checkImage = await this.mediaRepository.count({ where: { id: imageId, type: MediaTypesEnum.IMAGE } });

            if (!checkImage) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_IMAGE });
            }
        }

        return this.categoryRepository.save({
            ...isExist,
            imageId: imageId ? imageId : null,
            parentId: parentId ? parentId : null,
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
