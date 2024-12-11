import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService :ConfigService) => ({
                type: 'postgres',
                // Taking the info from the .env file, if the variable is not present we throw an error
                host: configService.getOrThrow('POSTGRE_HOST'),
                port: configService.getOrThrow('POSTGRE_PORT'),
                database: configService.getOrThrow('POSTGRE_DB'),
                username: configService.getOrThrow('POSTGRE_USERNAME'),
                password: configService.getOrThrow('POSTGRE_PASSWORD'),
                autoLoadEntities: true,
                synchronize: configService.getOrThrow('POSTGRE_SYNCRONIZE')
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
