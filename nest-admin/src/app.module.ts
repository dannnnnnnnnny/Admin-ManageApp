import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ImageuploadModule } from './imageupload/imageupload.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db', // docker-compose.yml db (컨테이너의 Database)
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    ProductModule,
    OrderModule,
    ImageuploadModule,
  ]
})
export class AppModule {}
