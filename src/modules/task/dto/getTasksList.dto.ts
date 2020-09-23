import { IsNotEmpty, IsString } from 'class-validator';

import { BaseQueryParametersDTO } from './../../shared/dto/baseQueryParameters.dto';

export class GetTasksListDTO extends BaseQueryParametersDTO {
    @IsNotEmpty({ message: 'Enter an id of todo' })
    @IsString({ message: 'Please enter an id of todo' })
    public readonly todoId: string;

    @IsNotEmpty({ message: 'Enter an id of user' })
    @IsString({ message: 'Please enter an id of user' })
    public readonly userId: string;
}
