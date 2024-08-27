import { Body, Controller, Get, Post } from '@nestjs/common';
import { CLIENT_PRODUCT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { FindProductBaseDto } from '../../product-base/dto/product-base-get.dto';
import { GetProductInStockQueryDto } from '../dto/product-get.dto';
import { ProductService } from '../product.service';

@Controller(ROUTER.PRODUCT_CLIENT)
export class ProductClientController {
    constructor(private readonly productService: ProductService) {}

    @Post(CLIENT_PRODUCT_ROUTE.FIND)
    find(@Body() body: FindProductBaseDto) {
        return this.productService.find(body);
    }

    @Get(CLIENT_PRODUCT_ROUTE.FEATURED)
    featured() {
        return this.productService.featured();
    }

    @Post(CLIENT_PRODUCT_ROUTE.IN_STOCK)
    inStock(@Body() body: GetProductInStockQueryDto) {
        return this.productService.inStock(body);
    }
}
