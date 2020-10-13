import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';
import { DeleteCategoryDTO } from './../dto/deleteCategory.dto';
import { CreateCategoryDTO } from './../dto/createCategory.dto';
import { GetCategoriesListDTO } from './../dto/getCategoriesList.dto';
import { UpdateCategoryDTO } from './../dto/updateCategory.dto';
import { FilterCategoriesDTO } from './../dto/filterCategories.dto';
import { Category } from './../entity/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    public async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        const category = this.create(createCategoryDTO);
        await this.createQueryBuilder()
            .insert()
            .into(Category)
            .values(category)
            .execute()
            .then((category) => category)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return category;
    }

    public async updateCategory(updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
        const category = this.create(updateCategoryDTO);
        await this.createQueryBuilder()
            .update(Category)
            .set(category)
            .where('id = :categoryId', { categoryId: category.id })
            .andWhere('userId = :userId', { userId: category.userId })
            .execute()
            .then((category) => category)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return category;
    }

    public async deleteCategory(deleteCategoryDTO: DeleteCategoryDTO): Promise<Category> {
        const category = this.create(deleteCategoryDTO);
        await this.createQueryBuilder()
            .delete()
            .from(Category)
            .where('id = :categoryId', { categoryId: category.id })
            .andWhere('userId = :userId', { userId: category.userId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
        return category;
    }

    public async getCategory(categoryId: string, userId: string): Promise<Category | undefined> {
        return await this.createQueryBuilder()
            .select(['c'])
            .from(Category, 'c')
            .where('c.id = :categoryId', { categoryId })
            .andWhere('c.userId = :userId', { userId })
            .getOne()
            .then((category) => category)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getCategoriesList(getListCategoryOfUserDTO: GetCategoriesListDTO): Promise<FilterCategoriesDTO> {
        const { userId, sort, page, limit } = getListCategoryOfUserDTO;
        const query = this.createQueryBuilder();

        query.select(['c']);
        query.from(Category, 'c');
        query.where('c.userId = :userId', { userId });

        page > 0 && limit > 0 && query.skip((page - 1) * limit);
        page > 0 && limit < 0 && query.skip((page - 1) * 100);
        page < 0 && limit < 0 && query.skip((1 - 1) * 100);

        // todo added logic for sort parameters
        sort && query.orderBy(JSON.parse(sort));

        limit ? query.take(+limit) : query.take(100);

        const [categories, total] = await query
            .getManyAndCount()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return { categories, total };
    }
}
