import { Pipe, PipeTransform } from '@angular/core';

const K_SPLIT_LIMIT = 3;
const K_NO_TIME = "00:00:00";

@Pipe({
  name: 'timeWithoutSec'
})
export class TimeWithoutSecPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(null != value && K_NO_TIME != value){
      var splitted = value.split(":", K_SPLIT_LIMIT);
      return splitted[0] + ":" + splitted[1];
    }
    else{
      return "--:--"
    }
  }
}
