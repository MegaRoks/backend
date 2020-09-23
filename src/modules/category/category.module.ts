import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryGateway } from './category.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from './repository/category.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryRepository])],
    providers: [CategoryService, CategoryGateway],
    exports: [CategoryService],
})
export class CategoryModule {}
