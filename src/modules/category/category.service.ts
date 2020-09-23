import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { DeleteCategoryDTO } from './dto/deleteCategory.dto';
import { GetListCategoriesDTO } from './dto/getListCategory.dto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';
import { Category } from './entity/category.entity';

import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryRepository)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async createCategory(userId: string, createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        return await this.categoryRepository.createCategory(userId, createCategoryDTO);
    }

    public async updateCategory(userId: string, updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
        try {
            const category = await this.categoryRepository.getCategoryByCategoryIdAndUserId(updateCategoryDTO.id, userId);

            return await this.categoryRepository.updateCategory(category.id, updateCategoryDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteCategory(userId: string, deleteCategoryDTO: DeleteCategoryDTO): Promise<void> {
        try {
            const category = await this.categoryRepository.getCategoryByCategoryIdAndUserId(deleteCategoryDTO.id, userId);

            await this.categoryRepository.deleteCategory(userId, category.id);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfTodosCategories(getListCategoryOfUserDTO: GetListCategoriesDTO): Promise<{ categories: any[]; total: number }> {
        try {
            return await this.categoryRepository.getListOfTodosCategories(getListCategoryOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
