import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { maxEmailLength, maxNameLength, maxPasswordLength, minNameLength, minPasswordLength } from './../constants/userConstants';

export class CreateUserDTO {
    @IsNotEmpty({ message: 'Enter an email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @MaxLength(maxEmailLength, { message: `The email address must be less than ${maxEmailLength} characters` })
    public email: string;

    @IsNotEmpty({ message: 'Enter a first name' })
    @MaxLength(maxNameLength, { message: `The first name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The first name must be more than ${minNameLength} characters` })
    public firstName: string;

    @IsNotEmpty({ message: 'Enter a last name' })
    @MaxLength(maxNameLength, { message: `The last name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The last name must be more than ${minNameLength} characters` })
    public lastName: string;

    @IsNotEmpty({ message: 'Enter a password' })
    @MaxLength(maxPasswordLength, { message: `The password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The password must be more than ${minPasswordLength} characters` })
    public password: string;

    @IsNotEmpty({ message: 'Enter a confirmation password' })
    @MaxLength(maxPasswordLength, { message: `The confirmation password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The confirmation password must be more than ${minPasswordLength} characters` })
    public passwordConfirmation: string;
}
