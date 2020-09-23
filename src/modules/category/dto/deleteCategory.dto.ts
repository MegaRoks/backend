import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCategoryDTO {
    @IsNotEmpty({ message: 'Enter an id of category' })
    @IsString({ message: 'Please enter an id of category' })
    public readonly id: string;

    @IsNotEmpty({ message: 'Enter an id of user' })
    @IsString({ message: 'Please enter an id of user' })
    public readonly userId: string;
}
