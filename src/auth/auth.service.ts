import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AdminRoles } from '../common/enum/admin-roles';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private adminService: AdminsService,
        private jwtService: JwtService,
        private config: ConfigService,
        @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    private async generateTokens(id: number, email: string, role: string) {
        const payload = {
            id,
            email,
            role,
            is_active: true
        }

        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('ACCESS_TOKEN_KEY'),
            expiresIn: this.config.get('ACCESS_TOKEN_TIME'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('REFRESH_TOKEN_KEY'),
            expiresIn: this.config.get('REFRESH_TOKEN_TIME'),
        });

        if (role === 'USER') {
            await this.userRepo.update(id, { refresh_token: refreshToken });
        } else {
            await this.adminRepo.update(id, { refresh_token: refreshToken });
        }

        return { accessToken, refreshToken };
    }

    // =================> Admin <====================
    async adminSignUp(adminDto: CreateAdminDto) {
        if (adminDto.role) {
            const adminRole = adminDto.role.toUpperCase();
            if (adminRole && adminRole != AdminRoles.ADMIN) {
                throw new BadRequestException("Iltimos rolni togri kiriting ❗️");
            }
        }

        const existEmail = await this.adminService.findAdminByEmail(adminDto.email);
        if (existEmail) throw new BadRequestException("Bunday email band ❗️");

        const admin = await this.adminService.create(adminDto);
        return admin;
    }

    async adminSignIn(dto: SignInDto, res: Response) {
        const { email, password } = dto;
        const admin = await this.adminRepo.findOne({ where: { email } });
        if (!admin) throw new NotFoundException("Email yoki parolda hatolik ‼️");

        const adminPass = await bcrypt.compare(password, admin.password);
        if (!adminPass) throw new NotFoundException("Parol yoki emailda hatolik ‼️");

        const { accessToken, refreshToken } = await this.generateTokens(admin.id, admin.email, admin.role);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
        admin.refresh_token = hashedRefreshToken;
        await this.adminRepo.save(admin);

        res.cookie("refreshToken", refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true
        }
        );

        return {
            message: "User logged in",
            id: admin.id,
            accessToken,
        };
    }

    async adminSignOut(refreshToken: string, res: Response) {
        const adminData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });
        if (!adminData) {
            throw new BadRequestException("Notog'ri token yuborilgan");
        }

        const admin = await this.adminService.findOne(adminData.id);
        if (!admin) {
            throw new ForbiddenException("Admin not found");
        }

        admin.refresh_token = null;
        await this.adminRepo.save(admin);

        res.clearCookie("refreshToken");

        return {
            message: "Admin logged out successfully"
        };
    }
}
