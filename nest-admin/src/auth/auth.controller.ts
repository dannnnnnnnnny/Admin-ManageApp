import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
  constructor(
    private userService: UserService
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
    });
  }
}
