import { Pipe, PipeTransform } from '@angular/core';

const K_SPLIT_LIMIT = 3;

@Pipe({
  name: 'timeWithoutSec'
})
export class TimeWithoutSecPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    var splitted = value.split(":", K_SPLIT_LIMIT);
    return splitted[0] + ":" + splitted[1];
  }

}
