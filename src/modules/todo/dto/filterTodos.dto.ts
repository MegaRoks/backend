import { BaseFilterParameters } from 'src/modules/shared/dto/baseFilterParameters.dto';
import { Todo } from '../entity/todo.entity';

export class FilerTodosDTO extends BaseFilterParameters {
    readonly todos: Todo[];
}
