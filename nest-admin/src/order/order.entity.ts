import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  nickname: string;

  @Column()
  @Exclude()
  email: string;

  @CreateDateColumn()
  // tslint:disable-next-line: variable-name
  created_at: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];

  // Expose 데코레이터를 이용해서 nickname과 email을 합쳐서 반환!, 변수명에 따라 반환되는 값도 달라짐 ({ ..., "username" : "nickname email" })
  @Expose()
  get username(): string {
    return `${this.nickname} ${this.email}`
  }

  @Expose()
  get total(): number {
    return this.order_items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}