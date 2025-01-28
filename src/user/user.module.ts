import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { RouteRequest } from 'src/route-requests/entities/route-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, RouteRequest])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
