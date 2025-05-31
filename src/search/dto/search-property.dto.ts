import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GuestsDto {
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    adults: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    @Type(() => Number)
    children: number;
}

 export class SearchPropertyDto {
    @IsDateString()
    @IsOptional()
    checkInDate?: string;

    @IsDateString()
    @IsOptional()
    checkOutDate?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => GuestsDto)
    guests: GuestsDto;

    @IsOptional()
    @IsString()
    regionId: string;

    @IsString()
    @IsOptional()
    countryCode?: string;

    @IsNumber()
    @IsOptional()
    page?: number;

    @IsNumber()
    @IsOptional()
    pageSize?: number;
}