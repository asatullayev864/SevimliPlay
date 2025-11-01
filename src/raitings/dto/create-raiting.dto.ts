import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    Max
} from "class-validator";

export class CreateRaitingDto {
    @IsNotEmpty({ message: "content_id bo'sh bo'lishi mumkin emas" })
    @IsNumber({}, { message: "content_id raqam bo'lishi kerak" })
    content_id: number;

    @IsNotEmpty({ message: "profile_id bo'sh bo'lishi mumkin emas" })
    @IsNumber({}, { message: "profile_id raqam bo'lishi kerak" })
    profile_id: number;

    @IsNotEmpty({ message: "raiting majburiy maydon" })
    @IsNumber({}, { message: "raiting raqam bo'lishi kerak" })
    @Min(1, { message: "raiting kamida 1 bo'lishi kerak" })
    @Max(5, { message: "raiting ko'pi bilan 5 bo'lishi kerak" })
    raiting: number;

    @IsOptional()
    @IsString({ message: "review matn (string) bo'lishi kerak" })
    review?: string;
}