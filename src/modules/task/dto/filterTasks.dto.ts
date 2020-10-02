import { Task } from './../entity/task.entity';
import { BaseFilterParameters } from './../../shared/dto/baseFilterParameters.dto';

export class FilterTasksDTO extends BaseFilterParameters {
    readonly tasks: Task[];
}
