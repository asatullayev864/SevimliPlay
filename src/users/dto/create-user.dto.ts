import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: "Email noto'g'ri formatda" })
    email: string;

    @IsString()
    @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    password: string;

    @IsString()
    @MinLength(2, { message: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" })
    full_name: string;

    @IsOptional()
    @IsString()
    phone?: string;
}