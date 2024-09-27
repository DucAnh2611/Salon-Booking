import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CLIENT_PRODUCT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { FindProductBaseDto } from '../../product-base/dto/product-base-get.dto';
import { GetProductDetailParamDto } from '../../product-detail/dto/product-detail-get.dto';
import { GetProductInStockQueryDto } from '../dto/product-get.dto';
import { ProductClientService } from '../service/product-client.service';
import { ProductService } from '../service/product.service';

@Controller(ROUTER.PRODUCT_CLIENT)
export class ProductClientController {
    constructor(
        private readonly productService: ProductService,
        private readonly productClientService: ProductClientService,
    ) {}

    @Post(CLIENT_PRODUCT_ROUTE.FIND)
    find(@Body() body: FindProductBaseDto) {
        return this.productService.find(body);
    }

    @Get(CLIENT_PRODUCT_ROUTE.DETAIL)
    detail(@Param() params: GetProductDetailParamDto) {
        const { id } = params;
        return this.productClientService.detail(id);
    }

    @Get(CLIENT_PRODUCT_ROUTE.FEATURED)
    featured() {
        return this.productClientService.featured();
    }

    @Get(CLIENT_PRODUCT_ROUTE.RELATED)
    related(@Param() params: GetProductDetailParamDto) {
        const { id } = params;
        return this.productClientService.relatedProduct(id);
    }

    @Post(CLIENT_PRODUCT_ROUTE.ON_STOCK)
    onStock(@Body() body: GetProductInStockQueryDto) {
        return this.productClientService.onStock(body);
    }
}
