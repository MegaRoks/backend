import { IsOptional, IsBoolean } from 'class-validator';

import { BaseQueryParametersDTO } from './../../shared/dto/baseQueryParameters.dto';
import { UserRoleType } from './../types/userRole.type';

export class FindUsersDTO extends BaseQueryParametersDTO {
    @IsOptional()
    public firstName: string;

    @IsOptional()
    public lastName: string;

    @IsOptional()
    public email: string;

    @IsOptional()
    @IsBoolean()
    public isActive: boolean;

    @IsOptional()
    public role: UserRoleType;
}
