import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Usage:
 *   value | encodeURI
 * Example:
 *   {{ 2 | encodeURI }}
 *   formats to: 2
 */
@Pipe({ name: 'encodeURI', standalone: true })
export class EncodeURIPipe implements PipeTransform {
  transform(value: string): string {
    return encodeURI(value);
  }
}
