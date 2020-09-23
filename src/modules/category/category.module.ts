import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryGateway } from './category.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from './repository/category.repository';
import { UserRepository } from './../user/repository/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryRepository]), TypeOrmModule.forFeature([UserRepository])],
    providers: [CategoryService, CategoryGateway],
    exports: [CategoryService],
})
export class CategoryModule {}
