import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { VoucherApplyTypeEnum, VoucherTypeEnum } from '../../../common/enum/voucher.enum';

export class CreateVoucherDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    sDescription: string;

    @IsOptional()
    @IsString()
    lDescriptions: string;

    @IsNotEmpty()
    @IsEnum(VoucherTypeEnum)
    type: VoucherTypeEnum;

    @IsNotEmpty()
    @IsEnum(VoucherApplyTypeEnum)
    applyType: VoucherApplyTypeEnum;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    discount: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    minAmount: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    maxDiscount: number;

    @IsNotEmpty()
    @IsDate()
    startAt: Date;

    @IsOptional()
    @IsDate()
    endAt: Date;

    @IsOptional()
    @IsInt()
    @IsPositive()
    usageLimit: number;

    @IsOptional()
    @IsUUID('all')
    imageId: string;
}
