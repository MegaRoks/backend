import { IsString, IsEmail, IsOptional, IsNotEmpty, IsEnum, IsBoolean, MaxLength, MinLength } from 'class-validator';

import { maxEmailLength, maxNameLength, maxPasswordLength, minNameLength, minPasswordLength } from './../constants/userConstants';
import { UserRoleType } from './../types/userRole.type';

export class UpdateUserDTO {
    @IsOptional()
    @IsString({ message: 'Please enter a valid first name' })
    @MaxLength(maxNameLength, { message: `The first name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The first name must be more than ${minNameLength} characters` })
    public firstName: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid last name' })
    @MaxLength(maxNameLength, { message: `The last name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The last name must be more than ${minNameLength} characters` })
    public lastName: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @MaxLength(maxEmailLength, { message: `The email address must be less than ${maxEmailLength} characters` })
    public email: string;

    @IsOptional()
    @MaxLength(maxPasswordLength, { message: `The password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The password must be more than ${minPasswordLength} characters` })
    public password: string;

    @IsOptional()
    @MaxLength(maxPasswordLength, { message: `The confirmation password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The confirmation password must be more than ${minPasswordLength} characters` })
    public passwordConfirmation: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Enter a role' })
    @IsEnum(UserRoleType, { message: "Enter correct a user's role" })
    public role: UserRoleType;

    @IsOptional()
    @IsBoolean()
    public isActive: boolean;
}