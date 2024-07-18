import { Controller, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../shared/guard/accessToken.guard';
import { UserTypeGuard } from '../../../shared/guard/user-type.guard';
import { CategoryService } from '../category.service';

@UseGuards(AccessTokenGuard, UserTypeGuard)
@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
}
