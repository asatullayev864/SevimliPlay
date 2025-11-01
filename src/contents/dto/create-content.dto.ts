import { IsEnum, IsString, IsOptional, IsDateString, IsInt, Min, Max, IsBoolean, IsUrl } from "class-validator";
import { ContentLanguage, ContentMaturityLevel, ContentTypes } from "../../common/enum/content.enums";

export class CreateContentDto {
    @IsEnum(ContentTypes, { message: "type faqat MOVIES yoki SERIES bo'lishi mumkin" })
    type: ContentTypes;

    @IsString({ message: "title matn bo'lishi kerak" })
    title: string;

    @IsOptional()
    @IsString({ message: "description matn bo'lishi kerak" })
    description?: string;

    @IsDateString({}, { message: "release_date YYYY-MM-DD formatida bo'lishi kerak" })
    release_date: string;

    @IsEnum(ContentLanguage, { message: "language faqat UZB, RUS yoki ENG bo'lishi mumkin" })
    language: ContentLanguage;

    @IsString({ message: "country matn bo'lishi kerak" })
    country: string;

    @IsInt({ message: "duration_minutes butun son bo'lishi kerak" })
    @Min(1, { message: "duration_minutes 1 dan kichik bo'la olmaydi" })
    duration_minutes: number;

    @IsEnum(ContentMaturityLevel, { message: "maturity_level faqat 0+, 6+, 12+, 16+, 18+ bo'lishi mumkin" })
    maturity_level: ContentMaturityLevel;

    @IsOptional()
    @IsBoolean({ message: "is_published boolean bo'lishi kerak" })
    is_published?: boolean;

    @IsOptional()
    @IsUrl({}, { message: "trailer_url URL formatida bo'lishi kerak" })
    trailer_url?: string;
}