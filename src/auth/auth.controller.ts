import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';
import { CookieGetter } from '../common/decorator/cookie-getter.decorator';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/role.guard';
import { Roles } from '../common/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // =================> ADMIN SIGN UP (faqat SUPER_ADMIN) <====================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post('admin/signup')
  async adminSignUp(@Body() dto: CreateAdminDto) {
    const admin = await this.authService.adminSignUp(dto);
    return {
      message: "Admin muvaffaqiyatli ro'yxatdan o'tdi ✅",
      admin,
    };
  }

  // =================> ADMIN SIGN IN <====================
  @HttpCode(HttpStatus.OK)
  @Post('admin/signin')
  async adminSignIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminSignIn(dto, res);
  }

  // =================> ADMIN SIGN OUT <====================
  @HttpCode(HttpStatus.OK)
  @Post('admin/signout')
  adminSignOut(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminSignOut(refreshToken, res);
  }

  // =================> ADMIN REFRESH TOKEN <====================
  @HttpCode(HttpStatus.OK)
  @Post('admin/refresh')
  adminRefresh(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminRefresh(refreshToken, res);
  }

  // =================> USER SIGN UP <====================
  @Post('user/signup')
  async userSignUp(@Body() dto: CreateUserDto) {
    return this.authService.userSignUp(dto);
  }

  // =================> USER SIGN IN <====================
  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  async userSignIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.userSignIn(dto, res);
  }

  // =================> USER SIGN OUT <====================
  @HttpCode(HttpStatus.OK)
  @Post('user/signout')
  userSignOut(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.userSignOut(refreshToken, res);
  }

  // =================> USER REFRESH TOKEN <====================
  @HttpCode(HttpStatus.OK)
  @Post('user/refresh')
  userRefresh(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.userRefresh(refreshToken, res);
  }
}