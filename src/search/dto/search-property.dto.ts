import { IsDateString, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
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
    checkInDate: string;

    @IsDateString()
    checkOutDate: string;

    @ValidateNested()
    @Type(() => GuestsDto)
    guests: GuestsDto;

    @IsString()
    @IsOptional()
    regionId?: string;

    @IsString()
    @IsOptional()
    countryCode?: string;
} 