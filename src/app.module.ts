import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoutesModule } from './routes/routes.module';
import { AuthModule } from './auth/auth.module';0
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UserModule, RoutesModule, AuthModule, ChatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
