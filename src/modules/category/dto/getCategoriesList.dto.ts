import { IsNotEmpty, IsString } from 'class-validator';

import { BaseQueryParametersDTO } from './../../shared/dto/baseQueryParameters.dto';

export class GetCategoriesListDTO extends BaseQueryParametersDTO {
    @IsNotEmpty({ message: 'Enter an id of category' })
    @IsString({ message: 'Please enter an id of category' })
    public readonly userId: string;
}
