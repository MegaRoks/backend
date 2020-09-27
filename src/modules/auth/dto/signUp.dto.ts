import { User } from 'src/modules/user/entity/user.entity';

export class SignUpDTO {
    public user: User;
    public message: string;
}
