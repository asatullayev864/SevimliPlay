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
import { CreateUserDto } from '../users/dto/create-user.dto';

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
            if (adminRole && adminRole != AdminRoles.ADMIN || AdminRoles.MODERATOR) {
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

    async adminRefresh(refreshToken: string, res: Response) {
        if (!refreshToken) {
            throw new BadRequestException("Token topilmadi ❗️");
        }

        // 1. Tokenni tekshirish
        let decodedAdmin;
        try {
            decodedAdmin = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('REFRESH_TOKEN_KEY'),
            });
        } catch (err) {
            throw new ForbiddenException("Token yaroqsiz yoki muddati tugagan ❗️");
        }

        // 2. Adminni topish
        const admin = await this.adminRepo.findOne({
            where: { id: decodedAdmin.id },
        });
        if (!admin || !admin.refresh_token) {
            throw new ForbiddenException("Admin topilmadi yoki token mavjud emas ❗️");
        }

        // 3. Refresh tokenni solishtirish
        const isMatch = await bcrypt.compare(refreshToken, admin.refresh_token);
        if (!isMatch) {
            throw new ForbiddenException("Token mos emas ❗️");
        }

        // 4. Yangi tokenlar generatsiyasi
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
            admin.id,
            admin.email,
            admin.role,
        );

        const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 7);
        admin.refresh_token = hashedNewRefresh;
        await this.adminRepo.save(admin);

        // 5. Cookie’ni yangilash
        res.cookie("refreshToken", newRefreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: "Access token yangilandi ✅",
            accessToken,
        };
    }


    // ==================> User <=====================
    async userSignUp(userDto: CreateUserDto) {
        const existEmail = await this.userService.findUserByEmail(userDto.email);
        if (existEmail) {
            throw new BadRequestException("Bunday email allaqachon band ❗️");
        }

        userDto.password = await bcrypt.hash(userDto.password, 7);
        const newUser = await this.userService.create({
            ...userDto
        });

        return {
            message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi ✅",
            user: newUser,
        };
    }

    async userSignIn(dto: SignInDto, res: Response) {
        const { email, password } = dto;

        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) throw new NotFoundException("Email yoki parolda hatolik ‼️");

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) throw new NotFoundException("Email yoki parolda hatolik ‼️");

        const { accessToken, refreshToken } = await this.generateTokens(
            user.id,
            user.email,
            'USER',
        );

        const hashedRefresh = await bcrypt.hash(refreshToken, 7);
        user.refresh_token = hashedRefresh;
        await this.userRepo.save(user);

        res.cookie("refreshToken", refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: "Foydalanuvchi tizimga kirdi ✅",
            id: user.id,
            accessToken,
        };
    }

    async userSignOut(refreshToken: string, res: Response) {
        const userData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });

        if (!userData) {
            throw new BadRequestException("Notog'ri token yuborilgan ❗️");
        }

        const user = await this.userService.findOne(userData.id);
        if (!user) {
            throw new ForbiddenException("Foydalanuvchi topilmadi ❗️");
        }

        user.refresh_token = null;
        await this.userRepo.save(user);

        res.clearCookie("refreshToken");

        return {
            message: "Foydalanuvchi tizimdan chiqdi ✅",
        };
    }

    async userRefresh(refreshToken: string, res: Response) {
        if (!refreshToken) {
            throw new BadRequestException("Token topilmadi ❗️");
        }

        // 1. Tokenni verify qilish
        let decodedUser;
        try {
            decodedUser = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('REFRESH_TOKEN_KEY'),
            });
        } catch (err) {
            throw new ForbiddenException("Token yaroqsiz yoki muddati tugagan ❗️");
        }

        // 2. Foydalanuvchini topish
        const user = await this.userRepo.findOne({
            where: { id: decodedUser.id },
        });
        if (!user || !user.refresh_token) {
            throw new ForbiddenException("Foydalanuvchi topilmadi yoki token mavjud emas ❗️");
        }

        // 3. Tokenni solishtirish
        const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!isMatch) {
            throw new ForbiddenException("Token mos emas ❗️");
        }

        // 4. Yangi tokenlar yaratish
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
            user.id,
            user.email,
            'USER',
        );

        const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 7);
        user.refresh_token = hashedNewRefresh;
        await this.userRepo.save(user);

        // 5. Cookie yangilash
        res.cookie("refreshToken", newRefreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: "Access token yangilandi ✅",
            accessToken,
        };
    }
}
