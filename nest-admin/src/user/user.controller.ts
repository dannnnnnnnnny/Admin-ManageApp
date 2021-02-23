import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Get()
  async all(@Query('page') page: number = 1): Promise<PaginatedResult> {
    return this.userService.paginate(page, ['role']);
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);

    const { role_id, ...data} = body;

    return this.userService.create({
      ...data,
      password,
      role: { id: role_id } // 외래키 role_id는 number로 넣어주는 게 아닌, 객체로서 넣어줘야 함.
    });
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.userService.findOne({ id }, ['role']);
  }

  @Put('info')
  async updateInfo(
    @Body() body: UserUpdateDto,
    @Req() request: Request
    ) {
    const id = await this.authService.userId(request);
    await this.userService.update(id, body);

    return this.userService.findOne({ id }, ['role']);
  }

  @Put('password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    // tslint:disable-next-line: variable-name
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }

    const id = await this.authService.userId(request);
    const hash = await bcrypt.hash(password, 12);

    await this.userService.update(id, {
      password: hash
    });

    return this.userService.findOne(id, ['role']);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...data} = body;
    await this.userService.update(id, {
      ...data,
      role: { id: role_id }
    });

    return this.userService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
