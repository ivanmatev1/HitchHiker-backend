import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { RouteStop } from './entities/routeStop.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Users } from 'src/user/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Message } from 'src/chats/entities/messages.entity';
import { RouteRequest } from 'src/route-requests/entities/route-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteStop, Users, Chat, Message, RouteRequest]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.getOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [RoutesController],
  providers: [RoutesService, ChatsService],
  exports: [RoutesService],
})
export class RoutesModule { }
