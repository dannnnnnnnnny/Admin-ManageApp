import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
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

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('인증이 유효하지 않습니다.');
    }

    return user;
  }
}
