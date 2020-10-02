import { BaseFilterParameters } from './../../shared/dto/baseFilterParameters.dto';
import { User } from './../entity/user.entity';

export class FilterUsersDTO extends BaseFilterParameters {
    readonly users: User[];
}
