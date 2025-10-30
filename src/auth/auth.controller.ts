import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';
import { CookieGetter } from '../common/decorator/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // =================> ADMIN SIGN UP <====================
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
  async adminSignIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.adminSignIn(dto, res);
    return result;
  }

  // =================> ADMIN SIGN OUT <====================
  @HttpCode(HttpStatus.OK)
  @Post('admin/signout')
  adminSignOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.adminSignOut(refreshToken, res);
  }
}