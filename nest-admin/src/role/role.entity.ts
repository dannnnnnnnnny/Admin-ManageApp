import { Permission } from 'src/permission/permission.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permissions', // 새롭게 생길 테이블명
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },  // name: 해당 entity컬럼명 지정, referencedColumnName: Join 대상 Entity 컬럼명
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
  })
  permissions: Permission[];
}