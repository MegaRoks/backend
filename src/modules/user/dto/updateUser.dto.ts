import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, MaxLength, MinLength, Matches } from 'class-validator';

import { match, maxEmailLength, maxNameLength, maxPasswordLength, minNameLength, minPasswordLength } from './../constants/userConstants';
import { UserRoleType } from './../types/userRole.type';

export class UpdateUserDTO {
    @IsOptional()
    @IsString({ message: 'Please enter a valid first name' })
    @MaxLength(maxNameLength, { message: `The first name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The first name must be more than ${minNameLength} characters` })
    public firstName?: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid last name' })
    @MaxLength(maxNameLength, { message: `The last name must be less than ${maxNameLength} characters` })
    @MinLength(minNameLength, { message: `The last name must be more than ${minNameLength} characters` })
    public lastName?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @MaxLength(maxEmailLength, { message: `The email address must be less than ${maxEmailLength} characters` })
    public email?: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid password' })
    @MaxLength(maxPasswordLength, { message: `The password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The password must be more than ${minPasswordLength} characters` })
    @Matches(match, { message: 'The password must contain at least one uppercase letter, one lowercase letter, a number or a symbol' })
    public password?: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid confirmation password' })
    @MaxLength(maxPasswordLength, { message: `The confirmation password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The confirmation password must be more than ${minPasswordLength} characters` })
    @Matches(match, { message: 'The confirmation password must contain at least one uppercase letter, one lowercase letter, a number or a symbol' })
    public passwordConfirmation?: string;

    @IsOptional()
    @IsEnum(UserRoleType, { message: "Enter correct a user's role" })
    public role?: UserRoleType;

    @IsOptional()
    @IsBoolean({ message: 'Please enter a valid active field' })
    public isActive?: boolean;

    @IsOptional()
    @IsString({ message: 'Please enter a valid confirmation token' })
    public confirmationToken?: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid recover token' })
    public recoverToken?: string;

    @IsOptional()
    @IsString({ message: 'Please enter a valid recover salt' })
    public salt?: string;
}