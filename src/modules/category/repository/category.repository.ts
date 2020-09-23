import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDTO } from './../dto/createCategory.dto';
import { GetListCategoriesDTO } from './../dto/getListCategory.dto';
import { UpdateCategoryDTO } from './../dto/updateCategory.dto';
import { Category } from './../entity/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    public async createCategory(userId: string, createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        const category = this.create({ userId, ...createCategoryDTO });
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

    public async updateCategory(userId: string, updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
        const category = this.create(updateCategoryDTO);
        await this.createQueryBuilder()
            .update(Category)
            .set(category)
            .where('id = :categoryId', { categoryId: category.id })
            .andWhere('userId = :userId', { userId })
            .execute()
            .then((category) => category)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return category;
    }

    public async deleteCategory(userId: string, categoryId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(Category)
            .where('id = :categoryId', { categoryId })
            .andWhere('userId = :userId', { userId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getCategoryByCategoryIdAndUserId(categoryId: string, userId: string): Promise<Category> {
        const category = await this.createQueryBuilder()
            .select(['t'])
            .from(Category, 't')
            .leftJoinAndSelect('c.tasks', 'task')
            .leftJoinAndSelect('c.todos', 'todo')
            .where('c.id = :categoryId', { categoryId })
            .andWhere('c.userId = :userId', { userId })
            .getOne()
            .then((category) => category)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        if (!category) {
            throw new WsException('Todo not found');
        }

        return category;
    }

    public async getListOfTodosCategories(getListCategoryOfUserDTO: GetListCategoriesDTO): Promise<{ categories: Category[]; total: number }> {
        const { userId, sort, page, limit } = getListCategoryOfUserDTO;
        const query = this.createQueryBuilder();

        query.select(['t']);
        query.from(Category, 't');
        query.leftJoinAndSelect('c.tasks', 'task');
        query.leftJoinAndSelect('c.todos', 'todo');
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
