import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetUserId } from './../user/decorators/getUserId.decorator';

import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { DeleteCategoryDTO } from './dto/deleteCategory.dto';
import { GetListCategoriesDTO } from './dto/getListCategory.dto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';
import { Category } from './entity/category.entity';

@WebSocketGateway()
export class CategoryGateway {
    constructor(private readonly categoryService: CategoryService) {}

    public handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log('Disconnected', client.id);
    }

    public handleConnection(@ConnectedSocket() client: Socket) {
        console.log('Connected', client.id);
    }

    @SubscribeMessage('createCategory')
    public async handleCreateCategory(
        @GetUserId() userId: string,
        @MessageBody() createCategoryDTO: CreateCategoryDTO,
    ): Promise<WsResponse<Category>> {
        const category = await this.categoryService.createCategory(userId, createCategoryDTO);

        return { event: 'createdCategory', data: category };
    }

    @SubscribeMessage('updateCategory')
    public async handleUpdateCategory(
        @GetUserId() userId: string,
        @MessageBody() updateCategoryDTO: UpdateCategoryDTO,
    ): Promise<WsResponse<Category>> {
        const category = await this.categoryService.updateCategory(userId, updateCategoryDTO);

        return { event: 'updatedCategory', data: category };
    }

    @SubscribeMessage('deleteCategory')
    public async handleDeleteCategory(
        @GetUserId() userId: string,
        @MessageBody() deleteCategoryDTO: DeleteCategoryDTO,
    ): Promise<WsResponse<{ message: string }>> {
        await this.categoryService.deleteCategory(userId, deleteCategoryDTO);

        return { event: 'deletedCategory', data: { message: 'Category deleted successfully' } };
    }

    @SubscribeMessage('getListOfTodosCategories')
    public async handleGetListOfTodosCategories(
        @MessageBody() getListOfCategoriesDTO: GetListCategoriesDTO,
    ): Promise<WsResponse<{ categories: any[]; total: number }>> {
        const categories = await this.categoryService.getListOfTodosCategories(getListOfCategoriesDTO);

        return { event: 'gotListOfTodosCategories', data: categories };
    }
}
