import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get()
  async all(@Query('page') page: number = 1): Promise<PaginatedResult> {
    return await this.userService.paginate(page, ['role']);
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
