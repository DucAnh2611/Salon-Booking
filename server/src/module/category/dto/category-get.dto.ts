import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetParamCategoryDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
