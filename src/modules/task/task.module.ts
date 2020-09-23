import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskGateway } from './task.gateway';
import { TaskRepository } from './repository/task.repository';


@Module({
    imports: [TypeOrmModule.forFeature([TaskRepository])],
    providers: [TaskService, TaskGateway],
    exports: [TaskService],
})
export class TaskModule {}
