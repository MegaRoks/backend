import { BaseFilterParameters } from 'src/modules/shared/dto/baseFilterParameters.dto';
import { Category } from './../entity/category.entity';

export class FilterCategoriesDTO extends BaseFilterParameters {
    readonly categories: Category[];
}
