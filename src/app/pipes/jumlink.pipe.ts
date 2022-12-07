import { Pipe, PipeTransform } from '@angular/core';
const JUMP_REGEXP = /\/detail(.*)/;
@Pipe({ name: 'slug', standalone: true })
export class SlugPipe implements PipeTransform {
  transform(value: Record<string, any>): string {
    const { title, name, localName } = value;

    const createSlug = () => {
      return (
        title ||
        name ||
        localName ||
        (Math.random() + 1).toString(36).substring(7)
      )
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    };

    return createSlug();
  }
}

@Pipe({ name: 'queryParams', standalone: true })
export class QueryParamsPipe implements PipeTransform {
  transform(value: Record<string, any>): Record<string, any> {
    const { jumpAddress, contentId, domainType, starId, id, category } = value;

    const createId = () => {
      if (JUMP_REGEXP.test(jumpAddress)) {
        const parameters = new URLSearchParams(
          JUMP_REGEXP.exec(jumpAddress)![1]
        );
        return {
          id: parameters.get('id'),
          category: parameters.get('type'),
        };
      }
      if (contentId || id) {
        return {
          id: contentId || id,
          category: domainType || category,
        };
      }
      if (starId) {
        return { id: starId };
      }
      return {};
    };

    return createId();
  }
}
