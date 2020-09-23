import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTodoDTO {
    @IsNotEmpty({ message: 'Enter an id of todo' })
    @IsString({ message: 'Please enter an id of todo' })
    public readonly id: string;

    @IsNotEmpty({ message: 'Enter an id of user' })
    @IsString({ message: 'Please enter an id of user' })
    public readonly userId: string;
}
