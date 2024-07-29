import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCartServiceItemDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;
}
