import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchProvinceQuery {
    @IsNotEmpty()
    @IsString()
    q: string;
}

export class GetProvinceCodeParams {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    code: number;
}

export class ListDistrictQuery {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    p: number;
}

export class SearchDistrictQuery {
    @IsNotEmpty()
    @IsString()
    q: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    p?: number;
}

export class GetDistrictCodeParams {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    code: number;
}

export class ListWardQuery {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    d: number;
}

export class SearchWardQuery {
    @IsNotEmpty()
    @IsString()
    q: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    p?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    d?: number;
}

export class GetWardCodeParams {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsInt()
    code: number;
}
