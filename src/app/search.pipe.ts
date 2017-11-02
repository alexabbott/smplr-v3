import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {

    transform(items: any, term: any): any {
        if (term === undefined || term === '') return items;

        if (items) {
            return items.filter((item) => {
                return item.name.toLowerCase().includes(term.toLowerCase());
            })
        }
    }
}