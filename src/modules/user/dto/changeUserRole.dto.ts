import { IsNotEmpty, IsEnum } from 'class-validator';

import { UserRoleType } from './../types/userRole.type';

export class ChangeUserRoleDTO {
    @IsNotEmpty({ message: 'Enter a role' })
    @IsEnum(UserRoleType, { message: 'Enter correct a user\'s role'})
    public role: UserRoleType;
}
