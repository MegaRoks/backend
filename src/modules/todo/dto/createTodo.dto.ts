import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { maxTitleLength, minTitleLength } from './../constants/constantsTodo';

export class CreateTodoDTO {
    @IsNotEmpty({ message: 'Enter a title' })
    @IsString({ message: 'Please enter a valid title' })
    @MaxLength(maxTitleLength, { message: `The title must be less than ${maxTitleLength} characters` })
    @MinLength(minTitleLength, { message: `The title must be more than ${minTitleLength} characters` })
    public readonly title: string;
}
