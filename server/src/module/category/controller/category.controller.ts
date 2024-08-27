import { Controller, Get, UseGuards } from '@nestjs/common';
import { ROLE_TITLE } from '../../../common/constant/role.constant';
import { CLIENT_CATEGORY_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { UserType } from '../../../shared/decorator/user-types.decorator';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CategoryService } from '../category.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller(ROUTER.CATEGORY)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @UserType(ROLE_TITLE.client)
    @Get(CLIENT_CATEGORY_ROUTE.TREE)
    tree() {
        return this.categoryService.tree();
    }
}
