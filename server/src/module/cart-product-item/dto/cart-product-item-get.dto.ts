import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCartProductParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
export class GetCartProductAmountDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    itemIds: string[];

    @IsNotEmpty()
    @IsUUID('all')
    cartProductId: string;
}
