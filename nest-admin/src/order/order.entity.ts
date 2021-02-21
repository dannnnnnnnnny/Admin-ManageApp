import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @CreateDateColumn()
  // tslint:disable-next-line: variable-name
  created_at: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];
}