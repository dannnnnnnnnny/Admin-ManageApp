import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // @UseInterceptors(ClassSerializerInterceptor) 인터셉터를 통해 password가 제거됨
  password: string;
}