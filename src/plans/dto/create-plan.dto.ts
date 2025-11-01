import { IsString, IsNumber, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreatePlanDto {
    @IsString()
    @MaxLength(255)
    title: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @IsString()
    @MaxLength(10)
    currency: string;

    @IsString()
    @MaxLength(50)
    billing_period: string;

    @IsString()
    @MaxLength(50)
    video_quality: string;

    @IsInt()
    @IsPositive()
    max_profiles: number;

    @IsInt()
    @IsPositive()
    concurrent_streams: number;
}