import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { passwordLength } from './../constants/userConstants';

export class CreateUserDTO {
    @IsNotEmpty({ message: 'Enter an email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @MaxLength(200, { message: 'The email address must be less than 200 characters' })
    public email: string;

    @IsNotEmpty({ message: 'Enter a first name' })
    @MaxLength(200, { message: 'The email first name must be less than 200 characters' })
    public firstName: string;

    @IsNotEmpty({ message: 'Enter a last name' })
    @MaxLength(200, { message: 'The last name must be less than 200 characters' })
    public lastName: string;

    @IsNotEmpty({ message: 'Enter a password' })
    @MinLength(6, { message: `Password must be at least ${passwordLength} characters` })
    public password: string;

    @IsNotEmpty({ message: 'Enter a confirmation password' })
    @MinLength(6, { message: `Password must be at least ${passwordLength} characters` })
    public passwordConfirmation: string;
}
