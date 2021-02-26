import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // tslint:disable-next-line: variable-name
  product_title: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: 'order_id' }) // 1:N 관계에서 N 쪽에서 JoinColumn을 가짐
  order: Order;
}