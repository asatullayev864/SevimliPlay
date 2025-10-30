import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AdminRoles } from '../../common/enum/admin-roles';

export class CreateAdminDto {
    @IsEmail({}, { message: "Email noto'g'ri formatda" })
    email: string;

    @IsString()
    @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    password: string;

    @IsString()
    @IsNotEmpty({ message: "To'liq ism kiritilishi shart" })
    full_name: string;

    @IsOptional()
    role?: AdminRoles;
}