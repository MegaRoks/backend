import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { maxTitleLength, minTitleLength } from './../constants/constantsTask';

export class CreateTaskDTO {
    @IsNotEmpty({ message: 'Enter a title' })
    @IsString({ message: 'Please enter a valid title' })
    @MaxLength(maxTitleLength, { message: `The title must be less than ${maxTitleLength} characters` })
    @MinLength(minTitleLength, { message: `The title must be more than ${minTitleLength} characters` })
    public readonly title: string;

    @IsNotEmpty({ message: 'Enter an id of todo' })
    @IsString({ message: 'Please enter an id of todo' })
    public readonly todoId: string;

    @IsNotEmpty({ message: 'Enter an id of user' })
    @IsString({ message: 'Please enter an id of user' })
    public readonly userId: string;
}
