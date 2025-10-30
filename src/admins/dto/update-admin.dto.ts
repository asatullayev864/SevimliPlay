import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';
import { AdminRoles } from '../../common/enum/admin-roles';

export class UpdateAdminDto {
    @IsOptional()
    @IsEmail({}, { message: "Email noto'g'ri formatda" })
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    password?: string;

    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    role?: AdminRoles;
}