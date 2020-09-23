import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskGateway } from './task.gateway';
import { TaskRepository } from './repository/task.repository';
import { UserRepository } from './../user/repository/user.repository';


@Module({
    imports: [TypeOrmModule.forFeature([TaskRepository]), TypeOrmModule.forFeature([UserRepository])],
    providers: [TaskService, TaskGateway],
    exports: [TaskService],
})
export class TaskModule {}
