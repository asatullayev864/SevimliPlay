import { IsEnum, IsOptional } from 'class-validator';
import { Language, MaturityLevel } from '../../common/enum/profile.enums';

export class UpdateProfileDto {
    userId?: number;

    display_name?: string;

    avatar_url?: string;

    @IsOptional()
    @IsEnum(Language)
    language?: Language;

    maturity_level?: MaturityLevel;

    is_default?: boolean;
}
