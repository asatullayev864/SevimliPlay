import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Language, MaturityLevel } from '../../common/enum/profile.enums';

export class CreateProfileDto {
    @IsNumber()
    userId: number;

    @IsString()
    display_name: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsEnum(Language)
    language: Language;

    @IsOptional()
    @IsEnum(MaturityLevel)
    maturity_level?: MaturityLevel;

    @IsOptional()
    @IsBoolean()
    is_default?: boolean;
}