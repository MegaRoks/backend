import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { MessageData } from './../shared/decorators/messageData.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/createCategory.dto';
import { DeleteCategoryDTO } from './dto/deleteCategory.dto';
import { GetCategoriesListDTO } from './dto/getCategoriesList.dto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';
import { FilterCategoriesDTO } from './dto/filterCategories.dto';
import { Category } from './entity/category.entity';

@UseGuards(TokenGuard)
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
    public async handleCreateCategory(@MessageData() createCategoryDTO: CreateCategoryDTO): Promise<WsResponse<Category>> {
        const category = await this.categoryService.createCategory(createCategoryDTO);
        return { event: 'createdCategory', data: category };
    }

    @SubscribeMessage('updateCategory')
    public async handleUpdateCategory(@MessageData() updateCategoryDTO: UpdateCategoryDTO): Promise<WsResponse<Category>> {
        const category = await this.categoryService.updateCategory(updateCategoryDTO);
        return { event: 'updatedCategory', data: category };
    }

    @SubscribeMessage('deleteCategory')
    public async handleDeleteCategory(@MessageData() deleteCategoryDTO: DeleteCategoryDTO): Promise<WsResponse<Category>> {
        const category = await this.categoryService.deleteCategory(deleteCategoryDTO);
        return { event: 'deletedCategory', data: category };
    }

    @SubscribeMessage('getCategoriesList')
    public async handleGetListCategories(@MessageData() getListCategoriesDTO: GetCategoriesListDTO): Promise<WsResponse<FilterCategoriesDTO>> {
        const categories = await this.categoryService.getCategoriesList(getListCategoriesDTO);
        return { event: 'gotCategoriesList', data: categories };
    }
}
