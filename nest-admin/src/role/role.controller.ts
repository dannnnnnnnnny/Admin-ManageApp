import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async all() {
    return this.roleService.all(['permissions']);
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('permissions') ids: number[]
  ) {
    /*
      [1, 2]
      [ { id: 1 }, { id: 2 } ]
    */
    return this.roleService.create({
      name,
      permissions: ids.map((id) => ({ id }))
    });
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.roleService.findOne({ id }, ['permissions']);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[]
  ) {
    await this.roleService.update(id, { name });

    const role = await this.roleService.findOne({ id });

    return this.roleService.create({
      ...role,
      // tslint:disable-next-line: no-shadowed-variable
      permissions: ids.map((id) => ({ id }))
    })
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.roleService.delete(id);
  }
}
