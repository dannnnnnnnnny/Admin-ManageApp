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
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission/permission.guard';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // docker-compose.yml db (컨테이너의 Database)
      port: 5432,
      username: 'postgres',
      password: '12345678',
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ]
})
export class AppModule {}
