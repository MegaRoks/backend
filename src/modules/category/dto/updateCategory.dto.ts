import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { maxTitleLength, minTitleLength } from './../constants/constantsCategory';

export class UpdateCategoryDTO {
    @IsNotEmpty({ message: 'Enter an id of category' })
    @IsString({ message: 'Please enter an id of category' })
    public readonly id: string;

    @IsNotEmpty({ message: 'Enter a title' })
    @IsString({ message: 'Please enter a valid title' })
    @MaxLength(maxTitleLength, { message: `The title must be less than ${maxTitleLength} characters` })
    @MinLength(minTitleLength, { message: `The title must be more than ${minTitleLength} characters` })
    public readonly title: string;

    @IsNotEmpty({ message: 'Enter an id of user' })
    @IsString({ message: 'Please enter an id of user' })
    public readonly userId: string;
}
