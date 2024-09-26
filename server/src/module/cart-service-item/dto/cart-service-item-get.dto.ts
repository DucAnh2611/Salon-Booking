import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCartServiceItemParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class GetCartServiceAmountDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    itemIds: string[];

    @IsNotEmpty()
    @IsUUID('all')
    cartServiceId: string;
}
