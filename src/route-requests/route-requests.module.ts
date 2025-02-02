import { Module } from '@nestjs/common';
import { RouteRequestsService } from './route-requests.service';
import { RouteRequestsController } from './route-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'src/routes/entities/route.entity';
import { Users } from 'src/user/entities/user.entity';
import { RouteRequest } from './entities/route-request.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoutesService } from 'src/routes/routes.service';
import { RouteStop } from 'src/routes/entities/routeStop.entity';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [TypeOrmModule.forFeature([RouteRequest, Route, Users, RouteStop]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.getOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
    inject: [ConfigService],
  }),
    ChatsModule,
  ],
  controllers: [RouteRequestsController],
  providers: [RouteRequestsService, RoutesService],
})
export class RouteRequestsModule { }
