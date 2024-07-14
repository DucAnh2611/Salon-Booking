import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { VoucherApplyTypeEnum, VoucherTypeEnum } from '../../../common/enum/voucher.enum';

export class UpdateVoucherDto {
    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    sDescription: string;

    @IsOptional()
    @IsString()
    lDescriptions: string;

    @IsOptional()
    @IsEnum(VoucherTypeEnum)
    type: VoucherTypeEnum;

    @IsOptional()
    @IsEnum(VoucherApplyTypeEnum)
    applyType: VoucherApplyTypeEnum;

    @IsOptional()
    @IsInt()
    @IsPositive()
    discount: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    minAmount: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    maxDiscount: number;

    @IsOptional()
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
