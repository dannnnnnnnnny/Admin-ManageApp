import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';

@UseInterceptors(ClassSerializerInterceptor) // class-transformer의 Exclude를 사용하기 위해 인터셉터 사용
@UseGuards(AuthGuard)
@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService
  ) {}

  @Get('orders')
  async all(@Query('page') page: number = 1) {
    return this.orderService.paginate(page, ['order_items']);
  }
}
