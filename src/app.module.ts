import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
    imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UserModule, TodoModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
