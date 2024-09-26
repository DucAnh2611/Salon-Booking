import { Controller, Get } from '@nestjs/common';
import { CLIENT_CATEGORY_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { CategoryService } from '../category.service';

@Controller(ROUTER.CATEGORY)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get(CLIENT_CATEGORY_ROUTE.TREE)
    tree() {
        return this.categoryService.tree();
    }

    @Get(CLIENT_CATEGORY_ROUTE.LIST)
    list() {
        return this.categoryService.list();
    }
}
