import { User } from './../../user/entity/user.entity';

export interface IJwtPayload {
    readonly user: User;
    readonly iat: number;
    readonly exp: number;
}
