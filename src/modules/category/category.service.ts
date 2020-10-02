import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { DeleteCategoryDTO } from './dto/deleteCategory.dto';
import { FilterCategoriesDTO } from './dto/filterCategories.dto';
import { GetCategoriesListDTO } from './dto/getCategoriesList.dto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';
import { Category } from './entity/category.entity';

import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryRepository)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    public async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        return await this.categoryRepository.createCategory(createCategoryDTO);
    }

    public async updateCategory(updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
        try {
            const category = await this.categoryRepository.getCategory(updateCategoryDTO.id, updateCategoryDTO.userId);

            if (!category) {
                throw new WsException('Todo not found');
            }

            return await this.categoryRepository.updateCategory(updateCategoryDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteCategory(deleteCategoryDTO: DeleteCategoryDTO): Promise<void> {
        try {
            const category = await this.categoryRepository.getCategory(deleteCategoryDTO.id, deleteCategoryDTO.userId);

            if (!category) {
                throw new WsException('Todo not found');
            }

            await this.categoryRepository.deleteCategory(deleteCategoryDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getCategoriesList(getListCategoriesDTO: GetCategoriesListDTO): Promise<FilterCategoriesDTO> {
        try {
            return await this.categoryRepository.getCategoriesList(getListCategoriesDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
