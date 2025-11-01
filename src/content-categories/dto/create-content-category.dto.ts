import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContentCategoryDto {
    @IsNotEmpty()
    @IsNumber()
    contentId: number;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
}