import { ClassSerializerInterceptor, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Parser } from 'json2csv'; 
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

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

  @Post('export')
  async export(@Res() res: Response) {
    const parser = new Parser({
      fields: ['ID', 'User', 'Product Title', 'Price', 'Quantity']
    });

    const orders = await this.orderService.all(['order_items']);
    const json = [];
    orders.forEach((o: Order) => {
      json.push({
        ID: o.id,
        User: o.username,
        'Product Title': '',
        Price: '',
        Quantity: ''
      });

      o.order_items.forEach((i: OrderItem) => {
        json.push({
          ID: '',
          User: '',
          'Product Title': i.product_title,
          Price: i.price,
          Quantity: i.quantity
        });
      })
    });

    const csv = parser.parse(json);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  }

  @Get('chart')
  async chart() {
    return this.orderService.chart();
  }
}