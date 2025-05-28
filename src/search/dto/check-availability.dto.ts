import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CheckAvailabilityDto {
    @IsString()
    @IsNotEmpty()
    accommodationCode: string;

    @IsString()
    @IsNotEmpty()
    userCode: string;

    @IsNumber()
    @IsNotEmpty()
    adultsNumber: number;

    @IsString()
    @IsNotEmpty()
    checkInDate: string;

    @IsString()
    @IsNotEmpty()
    checkOutDate: string;
} 