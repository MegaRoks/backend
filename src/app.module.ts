import { Module } from '@nestjs/common';

import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { LoggerModule } from './modules/logger/logger.module';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { TaskModule } from './modules/task/task.module';

@Module({
    imports: [DatabaseModule, AuthModule, UserModule, TodoModule, LoggerModule, MailModule, TokenModule, TaskModule],
    providers: [],
})
export class AppModule {}
