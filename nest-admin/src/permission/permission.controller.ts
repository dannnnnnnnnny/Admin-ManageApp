import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasPermission } from './has-permission.decorator';
import { PermissionService } from './permission.service';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permssionService: PermissionService) {}

  @Get()
  @HasPermission('view_permissions')
  async all() {
    return this.permssionService.all();
  }
}
