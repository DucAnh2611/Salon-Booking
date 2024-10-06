import { Controller, Get, Query } from '@nestjs/common';
import { CLIENT_CATEGORY_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { CategoryService } from '../category.service';
import { CategoryTreeDto } from '../dto/category-get.dto';

@Controller(ROUTER.CATEGORY)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get(CLIENT_CATEGORY_ROUTE.TREE)
    tree(@Query() query: CategoryTreeDto) {
        return this.categoryService.tree(query);
    }

    @Get(CLIENT_CATEGORY_ROUTE.LIST)
    list() {
        return this.categoryService.list();
    }
}
