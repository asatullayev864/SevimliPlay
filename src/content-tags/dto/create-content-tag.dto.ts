import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContentTagDto {
    @IsNotEmpty()
    @IsNumber()
    contentId: number;

    @IsNotEmpty()
    @IsNumber()
    tagId: number;
}