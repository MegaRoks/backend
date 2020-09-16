import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { match, maxPasswordLength, minPasswordLength } from './../../user/constants/userConstants';

export class ChangePasswordDTO {
    @IsString({ message: 'Enter a valid password' })
    @MaxLength(maxPasswordLength, { message: `The password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The password must be more than ${minPasswordLength} characters` })
    @Matches(match, { message: 'The password must contain at least one uppercase letter, one lowercase letter, a number or a symbol' })
    public password: string;

    @IsString({ message: 'Enter a valid confirmation password' })
    @MaxLength(maxPasswordLength, { message: `The confirmation password must be less than ${maxPasswordLength} characters` })
    @MinLength(minPasswordLength, { message: `The confirmation password must be more than ${minPasswordLength} characters` })
    @Matches(match, { message: 'The confirmation password must contain at least one uppercase letter, one lowercase letter, a number or a symbol' })
    public passwordConfirmation: string;
}
