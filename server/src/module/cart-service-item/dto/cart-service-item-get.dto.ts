import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCartServiceItemParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
