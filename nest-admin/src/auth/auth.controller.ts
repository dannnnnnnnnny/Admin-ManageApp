import { BadRequestException, Body, Controller, NotFoundException, Post, Res, Get, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      nickname: body.nickname,
      email: body.email,
      password: hashed,
      role: { id: 3 }
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('인증이 유효하지 않습니다.');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true }); // res 응답객체를 통해 쿠키에 'jwt'란 이름으로 jwt 저장

    return user;
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request);

    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: '로그아웃 성공'
    };
  }
}
