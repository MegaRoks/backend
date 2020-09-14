import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: configService => ({
                type: configService.get('DATABASE_TYPE'),
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: ['./dist/**/*.entity.{js,ts}'],
                synchronize: true,
                // logging: true,
                // migrationsRun: false,
                // migrations: ['./dist/modules/database/migration/*.{js,ts}'],
                // cli: {
                //     migrationsDir: 'src/modules/database/migration',
                // },
            }),
        }),
    ],
})
export class DatabaseModule {}
