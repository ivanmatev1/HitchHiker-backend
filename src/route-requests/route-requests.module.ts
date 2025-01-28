import { Module } from '@nestjs/common';
import { RouteRequestsService } from './route-requests.service';
import { RouteRequestsController } from './route-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'src/routes/entities/route.entity';
import { Users } from 'src/user/entities/user.entity';
import { RouteRequest } from './entities/route-request.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RouteRequest, Route, Users,]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.getOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [RouteRequestsController],
  providers: [RouteRequestsService],
})
export class RouteRequestsModule { }
